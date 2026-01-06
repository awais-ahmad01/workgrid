import { query } from "../lib/db.js";
import { createNotification } from "./notificationService.js";

/* -----------------------------------------------------
   RESOLVE TARGET USERS FROM ANNOUNCEMENT TARGETS
   Returns array of user IDs that should receive notifications
----------------------------------------------------- */
async function resolveTargetUsers({ targets, organizationId, createdBy }) {
  const targetUserIds = new Set();

  for (const target of targets) {
    if (target.type === "COMPANY") {
      // Get all active members in the organization
      const result = await query(
        `
        SELECT u.id
        FROM users u
        JOIN organization_members om ON om.user_id::uuid = u.id::uuid
        WHERE om.organization_id = $1::uuid
          AND om.status = 'active'
          AND u.id::uuid != $2::uuid
        `,
        [organizationId, createdBy]
      );
      result.rows.forEach((row) => targetUserIds.add(row.id));
    } else if (target.type === "ROLE" && target.id) {
      // Get all users with the specified role
      const result = await query(
        `
        SELECT u.id
        FROM users u
        JOIN organization_members om ON om.user_id::uuid = u.id::uuid
        WHERE om.organization_id = $1::uuid
          AND om.status = 'active'
          AND om.role::text = $2
          AND u.id::uuid != $3::uuid
        `,
        [organizationId, target.id, createdBy]
      );
      result.rows.forEach((row) => targetUserIds.add(row.id));
    } else if (target.type === "PROJECT" && target.id) {
      // Get all members of the project
      const result = await query(
        `
        SELECT DISTINCT u.id
        FROM users u
        JOIN project_members pm ON pm.user_id::uuid = u.id::uuid
        JOIN organization_members om ON om.user_id::uuid = u.id::uuid
        WHERE pm.project_id = $1::uuid
          AND om.organization_id = $2::uuid
          AND om.status = 'active'
          AND u.id::uuid != $3::uuid
        `,
        [target.id, organizationId, createdBy]
      );
      result.rows.forEach((row) => targetUserIds.add(row.id));
    }
  }
  return Array.from(targetUserIds);
}

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
  organizationId,
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

    // Create notifications for target users
    if (organizationId) {
      try {
        const targetUserIds = await resolveTargetUsers({
          targets,
          organizationId,
          createdBy,
        });

        // Get creator's name for notification meta
        const creatorResult = await query(
          `SELECT full_name FROM users WHERE id = $1::uuid`,
          [createdBy]
        );
        const creatorName = creatorResult.rows[0]?.full_name || "Someone";

        // Create notifications for each target user
        for (const userId of targetUserIds) {
          await createNotification({
            userId,
            type: "ANNOUNCEMENT",
            taskId: null, // Announcements don't have task_id
            commentId: null,
            meta: {
              announcementId: announcement.id,
              title: announcement.title,
              category: announcement.category,
              author: {
                id: createdBy,
                name: creatorName,
              },
            },
          }).catch((err) => {
            // Log error but don't fail announcement creation
            console.error(`Failed to create notification for user ${userId}:`, err);
          });
        }
      } catch (err) {
        // Log error but don't fail announcement creation
        console.error("Failed to create announcement notifications:", err);
      }
    }
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
    SET is_pinned = $1
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
