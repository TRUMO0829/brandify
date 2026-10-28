import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "./db.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  }),
);

app.use(
  express.json({
    limit: "50kb",
  }),
);

/* =========================================================
   UPLOADS
   server/uploads/ доторх файлуудыг browser-оос харах боломжтой
   ========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  (_req, res, next) => {
    // helmet-ийн анхдагч "same-origin" нь өөр origin-оос зураг ачаалахыг хаадаг
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads")),
);
/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/api/health", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT now()");

    res.json({
      ok: true,
      time: rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      error: "Database холболтын алдаа",
    });
  }
});

/* =========================================================
   ROUTES
   ========================================================= */

app.use("/api", publicRoutes);

app.use("/api/admin", adminRoutes);

/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err instanceof Error && err.name === "MulterError" ? 400 : 500).json({
    error: "Серверийн алдаа",
  });
});

/* =========================================================
   SERVER
   ========================================================= */

export default app;
