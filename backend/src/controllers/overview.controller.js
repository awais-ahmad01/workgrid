import { query } from "../lib/db.js";

export async function getSetupStatus(req, res) {
  const orgId = req.user.organizationId;

  const projects = await query(
    "SELECT COUNT(*) FROM projects WHERE organization_id = $1",
    [orgId]
  );

  const members = await query(
    "SELECT COUNT(*) FROM users WHERE organization_id = $1",
    [orgId]
  );

  res.json({
    hasProjects: Number(projects.rows[0].count) > 0,
    membersCount: Number(members.rows[0].count),
  });
}

export async function getProjectOverview(req, res) {
  const { projectId } = req.params;
  const { role, userId } = req.user;

  const members = await query(
    "SELECT COUNT(*) FROM project_members WHERE project_id = $1",
    [projectId]
  );

  let taskWhere = `project_id = $1`;
  const params = [projectId];

  // Interns only see their tasks
  if (["ROLE_INTERN", "ROLE_SENIOR_INTERN"].includes(role)) {
    taskWhere += " AND assignee_id = $2";
    params.push(userId);
  }

  const tasks = await query(
    `
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'Todo') as todo,
      COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
      COUNT(*) FILTER (WHERE status = 'Done') as done,
      COUNT(*) FILTER (WHERE due_date < NOW() AND status != 'Done') as overdue
    FROM tasks
    WHERE ${taskWhere}
    `,
    params
  );

  res.json({
    membersCount: Number(members.rows[0].count),
    tasks: tasks.rows[0],
    docsCount: 0,
    filesCount: 0,
    announcementsCount: 0,
    recentActivity: [],
  });
}
