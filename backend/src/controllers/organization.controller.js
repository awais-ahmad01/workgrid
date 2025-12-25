import { query } from "../lib/db.js";

export async function listOrganizationMembers(req, res) {
  const { orgId } = req.user;

  const result = await query(
    `
    SELECT u.id, u.full_name, u.email, om.role
    FROM organization_members om
    JOIN users u ON u.id = om.user_id
    WHERE om.organization_id = $1
    ORDER BY u.full_name
    `,
    [orgId]
  );

  res.json({ members: result.rows });
}
