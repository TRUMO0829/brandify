import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 20000,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = (text, params) => {
  return pool.query(text, params);
};
