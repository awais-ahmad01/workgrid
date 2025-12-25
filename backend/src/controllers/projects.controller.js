import { query } from '../lib/db.js'


export async function createProject(req, res) {
  const { name, description, memberIds = [] } = req.body;
  const { userId, orgId, role } = req.user;

  if (!['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  const projectRes = await query(
    `INSERT INTO projects (organization_id, name, description, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [orgId, name, description, userId]
  );

  const project = projectRes.rows[0];

  const uniqueMemberIds = [...new Set(memberIds)].filter(
  (id) => id !== userId
)

// creator
await query(
  `INSERT INTO project_members (project_id, user_id, role)
   VALUES ($1, $2, 'OWNER')
   ON CONFLICT (project_id, user_id) DO NOTHING`,
  [project.id, userId]
)

// members
for (const memberId of uniqueMemberIds) {
  await query(
    `INSERT INTO project_members (project_id, user_id, role)
     VALUES ($1, $2, 'MEMBER')
     ON CONFLICT (project_id, user_id) DO NOTHING`,
    [project.id, memberId]
  )
}


  res.status(201).json({ project });
}





export async function listProjects(req, res) {
  const { userId, orgId, role } = req.user;

  const queryText =
    role === 'SUPER_ADMIN' || role === 'ADMIN'
      ? `
        SELECT * FROM projects
        WHERE organization_id = $1 AND status = 'active'
      `
      : `
        SELECT p.*
        FROM projects p
        JOIN project_members pm ON pm.project_id = p.id
        WHERE pm.user_id = $2
          AND p.organization_id = $1
          AND p.status = 'active'
      `;

  const values =
    role === 'SUPER_ADMIN' || role === 'ADMIN'
      ? [orgId]
      : [orgId, userId];

  const result = await query(queryText, values);
  res.json({ projects: result.rows });
}





export async function updateProject(req, res) {
  const { projectId } = req.params;
  console.log("projectid:", projectId)
  const { name, description } = req.body;
  console.log("data:", name,description)
  const { userId, role } = req.user;

  const accessRes = await query(
    `SELECT role FROM project_members
     WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );

  const isOwner = accessRes.rows[0]?.role === 'OWNER';

  if (!isOwner && !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    return res.status(403).json({ message: 'No permission' });
  }

  await query(
    `UPDATE projects
     SET name = $1, description = $2, updated_at = now()
     WHERE id = $3`,
    [name, description, projectId]
  );

  res.json({ message: 'Project updated' });
}





export async function deleteProject(req, res) {
  const { projectId } = req.params;
  const { role } = req.user;

  if (!['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    return res.status(403).json({ message: 'Only admins can delete projects' });
  }

  await query(
    `UPDATE projects
     SET status = 'archived'
     WHERE id = $1`,
    [projectId]
  );

  res.json({ message: 'Project archived successfully' });
}




export async function addProjectMembers(req, res) {
  const { projectId } = req.params;
  const { userIds, projectRole = 'MEMBER' } = req.body;
  const { userId, orgId, role: orgRole } = req.user;

  if (!Array.isArray(userIds) || !userIds.length) {
    return res.status(400).json({ message: 'userIds array is required' });
  }

  // 1️⃣ Check project belongs to same org
  const projectRes = await query(
    `SELECT id FROM projects
     WHERE id = $1 AND organization_id = $2 AND status = 'active'`,
    [projectId, orgId]
  );

  if (!projectRes.rows.length) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // 2️⃣ Permission check
  let hasAccess = ['SUPER_ADMIN', 'ADMIN'].includes(orgRole);

  if (!hasAccess) {
    const pmRes = await query(
      `SELECT role FROM project_members
       WHERE project_id = $1 AND user_id = $2`,
      [projectId, userId]
    );

    hasAccess = ['OWNER', 'LEAD'].includes(pmRes.rows[0]?.role);
  }

  if (!hasAccess) {
    return res.status(403).json({ message: 'Not allowed to add members' });
  }

  // 3️⃣ Add members (only org members allowed)
  for (const uid of userIds) {
    await query(
      `INSERT INTO project_members (project_id, user_id, role)
       SELECT $1, $2, $3
       FROM organization_members
       WHERE user_id = $2 AND organization_id = $4
       ON CONFLICT (project_id, user_id) DO NOTHING`,
      [projectId, uid, projectRole, orgId]
    );
  }

  return res.status(201).json({
    message: 'Members added to project successfully'
  });
}


export async function getProjectMembers(req, res) {
  const { projectId } = req.params
  const { orgId } = req.user

  const result = await query(
    `
    SELECT 
      u.id,
      u.full_name,
      u.email,
      pm.role,
      p.name AS project_name,
      p.id AS project_id,
      p.description AS project_description
    FROM project_members pm
    JOIN users u ON u.id = pm.user_id
    JOIN projects p ON p.id = pm.project_id
    WHERE pm.project_id = $1
      AND p.organization_id = $2
    `,
    [projectId, orgId]
  )

  res.json({ members: result.rows })
}





export async function removeProjectMember(req, res) {
  const { projectId, memberId } = req.params;
  const { userId, orgId, role: orgRole } = req.user;

  // 1️⃣ Project validation
  const projectRes = await query(
    `SELECT id FROM projects
     WHERE id = $1 AND organization_id = $2`,
    [projectId, orgId]
  );

  if (!projectRes.rows.length) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // 2️⃣ Permission check
  let hasAccess = ['SUPER_ADMIN', 'ADMIN'].includes(orgRole);

  if (!hasAccess) {
    const pmRes = await query(
      `SELECT role FROM project_members
       WHERE project_id = $1 AND user_id = $2`,
      [projectId, userId]
    );

    hasAccess = pmRes.rows[0]?.role === 'OWNER';
  }

  if (!hasAccess) {
    return res.status(403).json({ message: 'Not allowed to remove members' });
  }

  // 3️⃣ Prevent owner self-removal
  if (userId === memberId) {
    return res.status(400).json({
      message: 'Project owner cannot remove themselves'
    });
  }

  // 4️⃣ Remove member
  const result = await query(
    `DELETE FROM project_members
     WHERE project_id = $1 AND user_id = $2`,
    [projectId, memberId]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: 'Member not found in project' });
  }

  return res.json({ message: 'Member removed from project' });
}

