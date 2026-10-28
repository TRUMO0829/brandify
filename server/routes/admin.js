import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { uploadImage, deleteImage } from "../storage.js";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const r = Router();

/* =========================================================
   MULTER - PORTFOLIO IMAGE UPLOAD
   ========================================================= */

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 4 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Зөвхөн JPG, PNG, WEBP төрлийн зураг оруулна уу."));
    }
  },
});

/* =========================================================
   HELPER - DELETE UPLOADED IMAGE
   ========================================================= */

async function deleteUploadedFile(image) {
  try { await deleteImage(image); }
  catch { console.error("Storage cleanup failed; retry removal manually."); }
}

/* =========================================================
   ADMIN LOGIN
   ========================================================= */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

r.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Нэвтрэх нэр болон нууц үг оруулна уу",
      });
    }

    const { rows } = await pool.query(
      `SELECT admin_id, username, password_hash
       FROM admin
       WHERE username = $1`,
      [username],
    );

    if (!rows.length) {
      return res.status(401).json({
        error: "Нэвтрэх нэр эсвэл нууц үг буруу",
      });
    }

    const admin = rows[0];

    const valid = await bcrypt.compare(password, admin.password_hash);

    if (!valid) {
      return res.status(401).json({
        error: "Нэвтрэх нэр эсвэл нууц үг буруу",
      });
    }

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    res.json({
      ok: true,
      token,
      admin: {
        admin_id: admin.admin_id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);

    res.status(500).json({
      error: "Нэвтрэх үед серверийн алдаа гарлаа",
    });
  }
});

/* =========================================================
   SERVICES
   ========================================================= */

// GET SERVICES
r.get("/services", requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        service_id,
        title,
        icon,
        description,
        bullets,
        steps,
        kpi,
        created_at,
        updated_at
       FROM service
       ORDER BY service_id`,
    );

    const result = rows.map((service) => ({
      ...service,
      bullets: parseList(service.bullets),
      steps: parseList(service.steps),
    }));

    res.json(result);
  } catch (err) {
    console.error("Get admin services error:", err);

    res.status(500).json({
      error: "Үйлчилгээнүүдийг авахад алдаа гарлаа",
    });
  }
});

// ADD SERVICE
r.post("/services", requireAdmin, async (req, res) => {
  try {
    const { title, icon, description, bullets, steps, kpi } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Үйлчилгээний нэр оруулна уу",
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO service
        (title, icon, description, bullets, steps, kpi)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title.trim(),
        icon || null,
        description || null,
        toJsonList(bullets),
        toJsonList(steps),
        kpi || null,
      ],
    );

    res.status(201).json({
      ...rows[0],
      bullets: parseList(rows[0].bullets),
      steps: parseList(rows[0].steps),
    });
  } catch (err) {
    console.error("Add service error:", err);

    res.status(500).json({
      error: "Үйлчилгээ нэмэхэд алдаа гарлаа",
    });
  }
});

// UPDATE SERVICE
r.put("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { title, icon, description, bullets, steps, kpi } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Үйлчилгээний нэр оруулна уу",
      });
    }

    const { rows } = await pool.query(
      `UPDATE service
       SET
         title = $1,
         icon = $2,
         description = $3,
         bullets = $4,
         steps = $5,
         kpi = $6,
         updated_at = CURRENT_TIMESTAMP
       WHERE service_id = $7
       RETURNING *`,
      [
        title.trim(),
        icon || null,
        description || null,
        toJsonList(bullets),
        toJsonList(steps),
        kpi || null,
        req.params.id,
      ],
    );

    if (!rows.length) {
      return res.status(404).json({
        error: "Үйлчилгээ олдсонгүй",
      });
    }

    res.json({
      ...rows[0],
      bullets: parseList(rows[0].bullets),
      steps: parseList(rows[0].steps),
    });
  } catch (err) {
    console.error("Update service error:", err);

    res.status(500).json({
      error: "Үйлчилгээ засахад алдаа гарлаа",
    });
  }
});

// DELETE SERVICE
r.delete("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM service
       WHERE service_id = $1`,
      [req.params.id],
    );

    if (!rowCount) {
      return res.status(404).json({
        error: "Үйлчилгээ олдсонгүй",
      });
    }

    res.json({
      ok: true,
    });
  } catch (err) {
    console.error("Delete service error:", err);

    if (err.code === "23503") {
      return res.status(409).json({
        error:
          "Энэ үйлчилгээнд хэрэглэгчийн хүсэлт холбогдсон тул устгах боломжгүй.",
      });
    }

    res.status(500).json({
      error: "Үйлчилгээ устгахад алдаа гарлаа",
    });
  }
});

/* =========================================================
   INQUIRIES
   ========================================================= */

// GET INQUIRIES
r.get("/inquiries", requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        i.inquiry_id,
        i.service_id,
        i.customer_name,
        i.customer_phone,
        i.customer_email,
        i.inquiry_date,
        i.status,
        i.company,
        i.budget,
        i.message,
        s.title AS service_title
       FROM inquiry i
       LEFT JOIN service s
         ON s.service_id = i.service_id
       ORDER BY i.inquiry_date DESC`,
    );

    res.json(rows);
  } catch (err) {
    console.error("Get inquiries error:", err);

    res.status(500).json({
      error: "Хүсэлтүүдийг авахад алдаа гарлаа",
    });
  }
});

// UPDATE INQUIRY STATUS
r.patch("/inquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Contacted", "Done"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Төлөв буруу байна",
      });
    }

    const { rows } = await pool.query(
      `UPDATE inquiry
       SET status = $1
       WHERE inquiry_id = $2
       RETURNING inquiry_id, status`,
      [status, req.params.id],
    );

    if (!rows.length) {
      return res.status(404).json({
        error: "Хүсэлт олдсонгүй",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Update inquiry status error:", err);

    res.status(500).json({
      error: "Төлөв өөрчлөхөд алдаа гарлаа",
    });
  }
});

// DELETE INQUIRY
r.delete("/inquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM inquiry
       WHERE inquiry_id = $1`,
      [req.params.id],
    );

    if (!rowCount) {
      return res.status(404).json({
        error: "Хүсэлт олдсонгүй",
      });
    }

    res.json({
      ok: true,
    });
  } catch (err) {
    console.error("Delete inquiry error:", err);

    res.status(500).json({
      error: "Хүсэлт устгахад алдаа гарлаа",
    });
  }
});

/* =========================================================
   PORTFOLIO
   ========================================================= */

// GET PORTFOLIO
r.get("/portfolio", requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
        portfolio_id,
        title,
        category,
        description,
        image,
        challenge,
        solution,
        timeline,
        result,
        created_at
       FROM portfolio
       ORDER BY created_at DESC`,
    );

    res.json(rows);
  } catch (err) {
    console.error("Get admin portfolio error:", err);

    res.status(500).json({
      error: "Гүйцэтгэсэн ажлуудыг авахад алдаа гарлаа",
    });
  }
});

// ADD PORTFOLIO + IMAGE
r.post("/portfolio", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      challenge,
      solution,
      timeline,
      result,
    } = req.body;

    if (!title || !title.trim()) {

      return res.status(400).json({
        error: "Ажлын нэр оруулна уу",
      });
    }

    const image = req.file ? await uploadImage(req.file) : null;
    req.uploadedImage = image;

    const { rows } = await pool.query(
      `INSERT INTO portfolio
          (
            title,
            category,
            description,
            image,
            challenge,
            solution,
            timeline,
            result
          )
         VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
      [
        title.trim(),
        category || null,
        description || null,
        image,
        challenge || null,
        solution || null,
        timeline || null,
        result || null,
      ],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Add portfolio error:", err);
    await deleteUploadedFile(req.uploadedImage);

    res.status(500).json({
      error: "Гүйцэтгэсэн ажил нэмэхэд алдаа гарлаа",
    });
  }
});

// UPDATE PORTFOLIO + OPTIONAL IMAGE
r.put(
  "/portfolio/:id",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        category,
        description,
        challenge,
        solution,
        timeline,
        result,
      } = req.body;

      if (!title || !title.trim()) {

        return res.status(400).json({
          error: "Ажлын нэр оруулна уу",
        });
      }

      // Existing portfolio
      const existingResult = await pool.query(
        `SELECT image
         FROM portfolio
         WHERE portfolio_id = $1`,
        [req.params.id],
      );

      if (!existingResult.rows.length) {

        return res.status(404).json({
          error: "Гүйцэтгэсэн ажил олдсонгүй",
        });
      }

      const oldImage = existingResult.rows[0].image;

      // If new image selected, use it.
      // Otherwise keep old image.
      const image = req.file
        ? await uploadImage(req.file)
        : oldImage;
      req.uploadedImage = req.file ? image : null;

      const { rows } = await pool.query(
        `UPDATE portfolio
         SET
           title = $1,
           category = $2,
           description = $3,
           image = $4,
           challenge = $5,
           solution = $6,
           timeline = $7,
           result = $8
         WHERE portfolio_id = $9
         RETURNING *`,
        [
          title.trim(),
          category || null,
          description || null,
          image,
          challenge || null,
          solution || null,
          timeline || null,
          result || null,
          req.params.id,
        ],
      );

      // New image successfully saved,
      // so delete old image.
      if (req.file && oldImage && oldImage !== image) {
        await deleteUploadedFile(oldImage);
      }

      res.json(rows[0]);
    } catch (err) {
      console.error("Update portfolio error:", err);
      await deleteUploadedFile(req.uploadedImage);

      res.status(500).json({
        error: "Гүйцэтгэсэн ажил засахад алдаа гарлаа",
      });
    }
  },
);

// DELETE PORTFOLIO + IMAGE
r.delete("/portfolio/:id", requireAdmin, async (req, res) => {
  try {
    const existingResult = await pool.query(
      `SELECT image
         FROM portfolio
         WHERE portfolio_id = $1`,
      [req.params.id],
    );

    if (!existingResult.rows.length) {
      return res.status(404).json({
        error: "Гүйцэтгэсэн ажил олдсонгүй",
      });
    }

    const image = existingResult.rows[0].image;

    const { rowCount } = await pool.query(
      `DELETE FROM portfolio
         WHERE portfolio_id = $1`,
      [req.params.id],
    );

    if (!rowCount) {
      return res.status(404).json({
        error: "Гүйцэтгэсэн ажил олдсонгүй",
      });
    }

    // Delete uploaded image from server
    if (image) {
      await deleteUploadedFile(image);
    }

    res.json({
      ok: true,
    });
  } catch (err) {
    console.error("Delete portfolio error:", err);

    res.status(500).json({
      error: "Гүйцэтгэсэн ажил устгахад алдаа гарлаа",
    });
  }
});

/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

function toJsonList(value) {
  if (!value) return JSON.stringify([]);

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed);
      }
    } catch {
      // JSON биш бол мөрүүдэд хуваана
    }

    return JSON.stringify(
      value
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    );
  }

  return JSON.stringify([]);
}

function parseList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // fallback
  }

  return String(value)
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default r;
