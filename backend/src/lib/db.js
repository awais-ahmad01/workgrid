import { Pool } from "pg";
import { SUPABASE_CONNECTION_STRING } from "../config/index.js";

export const db = new Pool({
  connectionString: SUPABASE_CONNECTION_STRING,
});

// optional small helper for queries
export async function query(text, params = []) {
  const client = await db.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}
