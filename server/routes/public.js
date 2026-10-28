import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { pool } from "../db.js";

const r = Router();

const toList = (s) => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  try {
    const v = JSON.parse(s);
    if (Array.isArray(v)) return v;
  } catch {}
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
};

r.get("/services", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT service_id, title, icon, description, bullets, steps, kpi FROM service ORDER BY service_id",
  );
  res.json(
    rows.map((s) => ({
      ...s,
      bullets: toList(s.bullets),
      steps: toList(s.steps),
    })),
  );
});

r.get("/portfolio", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT portfolio_id, title, category, description, image, challenge, solution, timeline, result FROM portfolio ORDER BY created_at DESC",
  );
  res.json(rows);
});

const inquirySchema = z.object({
  service_id: z.coerce.number().int().positive(),
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: z.string().trim().min(6).max(30),
  customer_email: z
    .union([z.literal(""), z.string().trim().email().max(150)])
    .optional(),
  company: z.string().trim().max(150).optional(),
  budget: z.string().trim().max(50).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().optional(), // honeypot: хүн бөглөхгүй
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

r.post("/inquiries", limiter, async (req, res) => {
  const p = inquirySchema.safeParse(req.body);
  if (!p.success) {
    return res
      .status(400)
      .json({ error: "Мэдээлэл буруу байна", details: p.error.issues });
  }
  const d = p.data;
  if (d.website) return res.status(201).json({ ok: true }); // бот: чимээгүй орхино
  try {
    const { rows } = await pool.query(
      `INSERT INTO inquiry (service_id, customer_name, customer_phone, customer_email, company, budget, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING inquiry_id`,
      [
        d.service_id,
        d.customer_name,
        d.customer_phone,
        d.customer_email || null,
        d.company || null,
        d.budget || null,
        d.message || null,
      ],
    );
    res.status(201).json({ ok: true, id: rows[0].inquiry_id });
  } catch (e) {
    if (e.code === "23503")
      return res.status(400).json({ error: "Үйлчилгээ олдсонгүй" });
    throw e;
  }
});

export default r;
