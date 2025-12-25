import { query } from "../lib/db.js";

/**
 * logActivity: create a task_activity entry
 *
 * @param {Object} opts
 *   - taskId
 *   - userId
 *   - action (string)
 *   - field (optional)
 *   - oldValue (optional)
 *   - newValue (optional)
 *   - metadata (optional json)
 */
export async function logActivity({
  taskId,
  userId,
  action,
  field = null,
  oldValue = null,
  newValue = null,
  metadata = {},
}) {
  const sql = `
    INSERT INTO task_activity (task_id, user_id, action, field, old_value, new_value, metadata)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
  `;
  const vals = [taskId, userId, action, field, oldValue, newValue, JSON.stringify(metadata)];
  const res = await query(sql, vals);
  return res.rows[0];
}
