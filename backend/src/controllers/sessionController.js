import { getAllowedModules } from "../services/accessPolicy.js";

import { query } from "../lib/db.js";

export async function getSessionUser(req, res) {
  try {
    const { userId, orgId, role } = req.user;

    const result = await query(
      `
      SELECT 
        u.id,
        u.email,
        u.full_name,
        o.id AS organization_id,
        o.name AS organization_name
      FROM users u
      JOIN organization_members om 
        ON om.user_id = u.id
      JOIN organizations o 
        ON o.id = om.organization_id
      WHERE u.id = $1
        AND om.organization_id = $2
        AND om.status = 'active'
      `,
      [userId, orgId]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Session user not found",
      });
    }

    const user = result.rows[0];

    return res.status(200).json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role,
      organization: {
        id: user.organization_id,
        name: user.organization_name,
      },
    });
  } catch (error) {
    console.error("GET SESSION USER ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch session user",
    });
  }
}

export function getSessionModules(req, res) {
  console.log("User role:", req.user.role);
  const modules = getAllowedModules(req.user.role);
  console.log("Allowed modules:", modules)
  res.json({
    role: req.user.role,
    allowedModules: modules,
  });
}
