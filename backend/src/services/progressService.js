import { query } from "../lib/db.js";

/**
 * Progress and Workload Service
 * Provides role-based data aggregation for progress and workload overview
 */

/**
 * Get Intern Personal Dashboard Data
 * Returns: tasks by status, upcoming deadlines, recently completed tasks, activity highlights
 */
export async function getInternDashboard({ userId, projectId }) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Tasks by status
  const tasksByStatus = await query(
    `
    SELECT 
      status,
      COUNT(*) as count
    FROM tasks
    WHERE assignee_id = $1::uuid 
      AND project_id = $2::uuid
    GROUP BY status
    ORDER BY 
      CASE status
        WHEN 'Backlog' THEN 1
        WHEN 'Todo' THEN 2
        WHEN 'In Progress' THEN 3
        WHEN 'Review' THEN 4
        WHEN 'Done' THEN 5
        ELSE 6
      END
    `,
    [userId, projectId]
  );

  // Upcoming deadlines (next 7 days, not completed)
  const upcomingDeadlines = await query(
    `
    SELECT 
      id,
      title,
      due_date,
      priority,
      status
    FROM tasks
    WHERE assignee_id = $1::uuid 
      AND project_id = $2::uuid
      AND due_date IS NOT NULL
      AND due_date >= NOW()
      AND due_date <= NOW() + INTERVAL '7 days'
      AND status != 'Done'
    ORDER BY due_date ASC
    LIMIT 10
    `,
    [userId, projectId]
  );

  // Recently completed tasks (last 7 days)
  const recentlyCompleted = await query(
    `
    SELECT 
      t.id,
      t.title,
      t.updated_at as completed_at,
      t.priority,
      t.due_date
    FROM tasks t
    WHERE t.assignee_id = $1::uuid 
      AND t.project_id = $2::uuid
      AND t.status = 'Done'
      AND t.updated_at >= $3
    ORDER BY t.updated_at DESC
    LIMIT 10
    `,
    [userId, projectId, sevenDaysAgo]
  );

  // Activity highlights (recent task activity)
  const activityHighlights = await query(
    `
    SELECT 
      ta.id,
      ta.action,
      ta.field,
      ta.created_at,
      t.id as task_id,
      t.title as task_title,
      u.full_name as user_name
    FROM task_activity ta
    JOIN tasks t ON t.id::uuid = ta.task_id::uuid
    LEFT JOIN users u ON u.id::uuid = ta.user_id::uuid
    WHERE ta.task_id IN (
      SELECT id FROM tasks 
      WHERE assignee_id = $1::uuid AND project_id = $2::uuid
    )
    AND ta.created_at >= $3
    ORDER BY ta.created_at DESC
    LIMIT 20
    `,
    [userId, projectId, sevenDaysAgo]
  );

  return {
    tasksByStatus: tasksByStatus.rows,
    upcomingDeadlines: upcomingDeadlines.rows,
    recentlyCompleted: recentlyCompleted.rows,
    activityHighlights: activityHighlights.rows,
  };
}

/**
 * Get Team Lead Overview Data
 * Returns: outstanding tasks by member, overdue items, workload per person, weekly summary
 */
export async function getTeamLeadOverview({ teamLeadId, projectId }) {
  // Get all team members in the project
  const teamMembers = await query(
    `
    SELECT DISTINCT
      u.id,
      u.full_name,
      u.email
    FROM project_members pm
    JOIN users u ON u.id::uuid = pm.user_id::uuid
    WHERE pm.project_id = $1::uuid
    ORDER BY u.full_name
    `,
    [projectId]
  );

  // Outstanding tasks by member
  const outstandingByMember = await query(
    `
    SELECT 
      t.assignee_id,
      u.full_name as assignee_name,
      u.email as assignee_email,
      COUNT(*) as task_count,
      COUNT(*) FILTER (WHERE t.status = 'Todo') as todo_count,
      COUNT(*) FILTER (WHERE t.status = 'In Progress') as in_progress_count,
      COUNT(*) FILTER (WHERE t.status = 'Review') as review_count
    FROM tasks t
    LEFT JOIN users u ON u.id::uuid = t.assignee_id::uuid
    WHERE t.project_id = $1::uuid
      AND t.status != 'Done'
      AND t.assignee_id IS NOT NULL
    GROUP BY t.assignee_id, u.full_name, u.email
    ORDER BY task_count DESC
    `,
    [projectId]
  );

  // Overdue items (all team members)
  const overdueItems = await query(
    `
    SELECT 
      t.id,
      t.title,
      t.due_date,
      t.priority,
      t.status,
      u.full_name as assignee_name,
      u.email as assignee_email
    FROM tasks t
    LEFT JOIN users u ON u.id::uuid = t.assignee_id::uuid
    WHERE t.project_id = $1::uuid
      AND t.due_date IS NOT NULL
      AND t.due_date < NOW()
      AND t.status != 'Done'
    ORDER BY t.due_date ASC
    `,
    [projectId]
  );

  // Workload per person (total tasks assigned, completed, in progress)
  const workloadPerPerson = await query(
    `
    SELECT 
      t.assignee_id,
      u.full_name as assignee_name,
      u.email as assignee_email,
      COUNT(*) as total_tasks,
      COUNT(*) FILTER (WHERE t.status = 'Done') as completed_tasks,
      COUNT(*) FILTER (WHERE t.status IN ('Todo', 'In Progress', 'Review')) as active_tasks,
      COUNT(*) FILTER (WHERE t.due_date < NOW() AND t.status != 'Done') as overdue_tasks
    FROM tasks t
    LEFT JOIN users u ON u.id::uuid = t.assignee_id::uuid
    WHERE t.project_id = $1::uuid
      AND t.assignee_id IS NOT NULL
    GROUP BY t.assignee_id, u.full_name, u.email
    ORDER BY total_tasks DESC
    `,
    [projectId]
  );

  // Weekly summary (tasks created vs completed in last 7 days)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weeklySummary = await query(
    `
    SELECT 
      DATE(t.created_at) as date,
      COUNT(*) FILTER (WHERE t.created_at >= $2) as created_count,
      COUNT(*) FILTER (WHERE t.status = 'Done' AND t.updated_at >= $2) as completed_count
    FROM tasks t
    WHERE t.project_id = $1::uuid
      AND (t.created_at >= $2 OR (t.status = 'Done' AND t.updated_at >= $2))
    GROUP BY DATE(t.created_at)
    ORDER BY date DESC
    LIMIT 7
    `,
    [projectId, oneWeekAgo]
  );

  return {
    teamMembers: teamMembers.rows,
    outstandingByMember: outstandingByMember.rows,
    overdueItems: overdueItems.rows,
    workloadPerPerson: workloadPerPerson.rows,
    weeklySummary: weeklySummary.rows,
  };
}

/**
 * Get HR/Admin High-Level View
 * Returns: activity and engagement metrics, project members, and project statistics
 */
export async function getAdminOverview({ projectId, organizationId }) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // Get project members with their roles (Team Lead, Interns, Senior Interns)
  const projectMembers = await query(
    `
    SELECT 
      u.id,
      u.full_name,
      u.email,
      om.role as org_role,
      pm.role as project_role,
      pm.added_at
    FROM project_members pm
    JOIN users u ON u.id::uuid = pm.user_id::uuid
    JOIN organization_members om ON om.user_id::uuid = u.id::uuid AND om.organization_id = $2::uuid
    WHERE pm.project_id = $1::uuid
      AND om.status = 'active'
    ORDER BY 
      CASE 
        WHEN om.role::text = 'TEAM_LEAD' THEN 1
        WHEN om.role::text = 'SENIOR_INTERN' THEN 2
        WHEN om.role::text LIKE '%INTERN%' THEN 3
        ELSE 4
      END,
      u.full_name
    `,
    [projectId, organizationId]
  );

  // Separate members by role
  const teamLead = projectMembers.rows.find(m => m.org_role === 'TEAM_LEAD' || m.project_role === 'LEAD' || m.project_role === 'OWNER');
  const interns = projectMembers.rows.filter(m => m.org_role === 'INTERN');
  const seniorInterns = projectMembers.rows.filter(m => m.org_role === 'SENIOR_INTERN');

  // Active interns (those with task activity in last 7 days)
  const activeInterns = await query(
    `
    SELECT DISTINCT
      u.id,
      u.full_name,
      u.email,
      om.role as org_role,
      COUNT(DISTINCT t.id) as task_count,
      COUNT(DISTINCT ta.id) as activity_count,
      MAX(ta.created_at) as last_activity_at
    FROM users u
    JOIN organization_members om ON om.user_id::uuid = u.id::uuid
    JOIN project_members pm ON pm.user_id::uuid = u.id::uuid AND pm.project_id = $1::uuid
    LEFT JOIN tasks t ON t.assignee_id::uuid = u.id::uuid AND t.project_id = $1::uuid
    LEFT JOIN task_activity ta ON ta.user_id::uuid = u.id::uuid 
      AND ta.task_id IN (SELECT id FROM tasks WHERE project_id = $1::uuid)
      AND ta.created_at >= $3
    WHERE om.organization_id = $2::uuid
      AND om.status = 'active'
      AND (om.role::text LIKE '%INTERN%' OR om.role::text = 'SENIOR_INTERN')
    GROUP BY u.id, u.full_name, u.email, om.role
    HAVING COUNT(DISTINCT ta.id) > 0 OR COUNT(DISTINCT t.id) > 0
    ORDER BY last_activity_at DESC NULLS LAST, activity_count DESC
    `,
    [projectId, organizationId, sevenDaysAgo]
  );

  // Project statistics (tasks, docs, files, announcements)
  const projectStats = await query(
    `
    SELECT 
      (SELECT COUNT(*) FROM tasks WHERE project_id = $1::uuid) as total_tasks,
      (SELECT COUNT(*) FROM tasks WHERE project_id = $1::uuid AND status = 'Todo') as todo_tasks,
      (SELECT COUNT(*) FROM tasks WHERE project_id = $1::uuid AND status = 'In Progress') as in_progress_tasks,
      (SELECT COUNT(*) FROM tasks WHERE project_id = $1::uuid AND status = 'Done') as done_tasks,
      (SELECT COUNT(*) FROM tasks WHERE project_id = $1::uuid AND due_date < NOW() AND status != 'Done') as overdue_tasks,
      (SELECT COUNT(*) FROM project_docs WHERE project_id = $1::uuid) as docs_count,
      (SELECT COUNT(*) FROM project_files WHERE project_id = $1::uuid) as files_count,
      (SELECT COUNT(*) FROM announcements a
       JOIN announcement_targets at ON at.announcement_id = a.id
       WHERE at.target_type = 'PROJECT' AND at.target_id = $1::text) as announcements_count
    `,
    [projectId]
  );

  // Overall engagement metrics (for interns in this project)
  const engagementMetrics = await query(
    `
    SELECT 
      COUNT(DISTINCT u.id) FILTER (WHERE om.role::text LIKE '%INTERN%' OR om.role::text = 'SENIOR_INTERN') as total_interns,
      COUNT(DISTINCT t.assignee_id) FILTER (WHERE t.project_id = $1::uuid) as interns_with_tasks,
      COUNT(*) FILTER (WHERE t.project_id = $1::uuid) as total_tasks,
      COUNT(*) FILTER (WHERE t.project_id = $1::uuid AND t.status = 'Done') as completed_tasks,
      COUNT(*) FILTER (WHERE t.project_id = $1::uuid AND t.due_date < NOW() AND t.status != 'Done') as overdue_tasks,
      COUNT(*) FILTER (WHERE ta.created_at >= $3 AND ta.task_id IN (SELECT id FROM tasks WHERE project_id = $1::uuid)) as recent_activities
    FROM organization_members om
    JOIN users u ON u.id::uuid = om.user_id::uuid
    JOIN project_members pm ON pm.user_id::uuid = u.id::uuid AND pm.project_id = $1::uuid
    LEFT JOIN tasks t ON t.assignee_id::uuid = u.id::uuid AND t.project_id = $1::uuid
    LEFT JOIN task_activity ta ON ta.user_id::uuid = u.id::uuid 
      AND ta.task_id IN (SELECT id FROM tasks WHERE project_id = $1::uuid)
      AND ta.created_at >= $3
    WHERE om.organization_id = $2::uuid
      AND om.status = 'active'
    `,
    [projectId, organizationId, sevenDaysAgo]
  );

  // Task completion rate by intern (only for this project)
  const completionRateByIntern = await query(
    `
    SELECT 
      u.id,
      u.full_name,
      u.email,
      om.role as org_role,
      COUNT(*) as total_assigned,
      COUNT(*) FILTER (WHERE t.status = 'Done') as completed,
      ROUND(
        CASE 
          WHEN COUNT(*) > 0 
          THEN (COUNT(*) FILTER (WHERE t.status = 'Done')::numeric / COUNT(*)::numeric) * 100
          ELSE 0
        END, 
        2
      ) as completion_rate
    FROM users u
    JOIN organization_members om ON om.user_id::uuid = u.id::uuid
    JOIN project_members pm ON pm.user_id::uuid = u.id::uuid AND pm.project_id = $1::uuid
    LEFT JOIN tasks t ON t.assignee_id::uuid = u.id::uuid AND t.project_id = $1::uuid
    WHERE om.organization_id = $2::uuid
      AND om.status = 'active'
      AND (om.role::text LIKE '%INTERN%' OR om.role::text = 'SENIOR_INTERN')
      AND t.id IS NOT NULL
    GROUP BY u.id, u.full_name, u.email, om.role
    HAVING COUNT(*) > 0
    ORDER BY completion_rate DESC, total_assigned DESC
    `,
    [projectId, organizationId]
  );

  const stats = projectStats.rows[0] || {};
  const metrics = engagementMetrics.rows[0] || {};

  return {
    // Project members organized by role
    projectMembers: {
      teamLead: teamLead || null,
      interns: interns,
      seniorInterns: seniorInterns,
      all: projectMembers.rows,
      total: projectMembers.rows.length,
    },
    // Project statistics
    projectStats: {
      membersCount: projectMembers.rows.length,
      totalTasks: parseInt(stats.total_tasks || 0),
      todoTasks: parseInt(stats.todo_tasks || 0),
      inProgressTasks: parseInt(stats.in_progress_tasks || 0),
      doneTasks: parseInt(stats.done_tasks || 0),
      overdueTasks: parseInt(stats.overdue_tasks || 0),
      docsCount: parseInt(stats.docs_count || 0),
      filesCount: parseInt(stats.files_count || 0),
      announcementsCount: parseInt(stats.announcements_count || 0),
    },
    // Engagement metrics
    engagementMetrics: {
      totalInterns: parseInt(metrics.total_interns || 0),
      internsWithTasks: parseInt(metrics.interns_with_tasks || 0),
      totalTasks: parseInt(metrics.total_tasks || 0),
      completedTasks: parseInt(metrics.completed_tasks || 0),
      overdueTasks: parseInt(metrics.overdue_tasks || 0),
      recentActivities: parseInt(metrics.recent_activities || 0),
    },
    // Active interns
    activeInterns: activeInterns.rows,
    // Completion rates
    completionRateByIntern: completionRateByIntern.rows,
  };
}

