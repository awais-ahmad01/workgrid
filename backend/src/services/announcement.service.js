import { query } from "../lib/db.js";

/* -----------------------------------------------------
   CREATE ANNOUNCEMENT
----------------------------------------------------- */
export async function createAnnouncement({
  title,
  body,
  category,
  createdBy,
  pinned = false,
  targets = [],
}) {
  const insertAnnouncementSQL = `
    INSERT INTO announcements
      (title, body, category, created_by, is_pinned)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const announcementRes = await query(insertAnnouncementSQL, [
    title,
    body,
    category,
    createdBy,
    pinned,
  ]);

  const announcement = announcementRes.rows[0];

  if (targets.length) {
    const values = [];
    const placeholders = targets.map((t, i) => {
      const base = i * 3;
      values.push(announcement.id, t.type, t.id || null);
      return `($${base + 1}, $${base + 2}, $${base + 3})`;
    });

    const insertTargetsSQL = `
      INSERT INTO announcement_targets
        (announcement_id, target_type, target_id)
      VALUES ${placeholders.join(", ")};
    `;

    await query(insertTargetsSQL, values);
  }

  return announcement;
}

/* -----------------------------------------------------
   LIST ANNOUNCEMENTS FOR USER
----------------------------------------------------- */
export async function listAnnouncementsForUser({
  userId,
  role,
  projectIds = [],
  filters = {},
}) {
  const clauses = [];
  const values = [];
  let idx = 1;

  if (filters.category) {
    clauses.push(`a.category = $${idx++}`);
    values.push(filters.category);
  }

  if (filters.fromDate) {
    clauses.push(`a.created_at >= $${idx++}`);
    values.push(filters.fromDate);
  }

  const where = clauses.length ? `AND ${clauses.join(" AND ")}` : "";

  const sql = `
    SELECT
      a.*,
      ar.read_at
    FROM announcements a
    LEFT JOIN announcement_reads ar
      ON ar.announcement_id = a.id
      AND ar.user_id = $${idx}::uuid
    WHERE EXISTS (
      SELECT 1
      FROM announcement_targets at
      WHERE at.announcement_id = a.id
        AND (
          at.target_type = 'COMPANY'
          OR (at.target_type = 'ROLE' AND at.target_id = $${idx + 1})
          OR (
            at.target_type = 'PROJECT'
            AND at.target_id = ANY($${idx + 2}::text[])
          )
        )
    )
    ${where}
    ORDER BY a.is_pinned DESC, a.created_at DESC;
  `;

  values.push(
    userId,                 // uuid
    role,                   // text
    projectIds.map(String)  // ✅ uuid[] → text[]
  );

  const res = await query(sql, values);

  return res.rows.map((row) => ({
    ...row,
    is_read: !!row.read_at,
  }));
}

/* -----------------------------------------------------
   MARK ANNOUNCEMENT AS READ
----------------------------------------------------- */
export async function markAnnouncementRead({ announcementId, userId }) {
  const sql = `
    INSERT INTO announcement_reads (announcement_id, user_id, read_at)
    VALUES ($1, $2, now())
    ON CONFLICT (announcement_id, user_id)
    DO UPDATE SET read_at = now();
  `;

  await query(sql, [announcementId, userId]);
}

/* -----------------------------------------------------
   PIN / UNPIN ANNOUNCEMENT
----------------------------------------------------- */
export async function togglePinAnnouncement({ announcementId, pinned }) {
  const sql = `
    UPDATE announcements
    SET pinned = $1
    WHERE id = $2
    RETURNING *;
  `;

  const res = await query(sql, [pinned, announcementId]);
  return res.rows[0];
}

/* -----------------------------------------------------
   DELETE ANNOUNCEMENT
----------------------------------------------------- */
export async function deleteAnnouncement({ announcementId }) {
  const sql = `
    DELETE FROM announcements
    WHERE id = $1
    RETURNING *;
  `;

  const res = await query(sql, [announcementId]);
  return res.rows[0];
}
