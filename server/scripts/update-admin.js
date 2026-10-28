import bcrypt from "bcryptjs";
import { pool } from "../db.js";

async function updateAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password.length < 12) throw new Error("Set ADMIN_USERNAME and ADMIN_PASSWORD (12+ characters)");

  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `INSERT INTO admin (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
      [username, hash],
    );
    console.log("Admin updated successfully");
  } catch (err) {
    console.error("Алдаа гарлаа:", err);
  } finally {
    await pool.end();
  }
}

updateAdmin();
