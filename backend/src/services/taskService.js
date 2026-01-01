// import { query } from "../lib/db.js";

// /**
//  * Create a new task
//  */
// export async function createTask({
//   title,
//   description = null,
//   projectId,
//   assigneeId = null,
//   createdBy,
//   status = "Backlog",
//   priority = "Medium",
//   dueDate = null,
//   tags = [],
//   metadata = {},
// }) {
//   const sql = `
//     INSERT INTO tasks
//       (title, description,project_id, assignee_id, created_by, status, priority, due_date, tags, metadata)
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
//     RETURNING *;
//   `;
//   const vals = [
//     title,
//     description,
//     projectId,
//     assigneeId,
//     createdBy,
//     status,
//     priority,
//     dueDate,
//     JSON.stringify(tags),
//     JSON.stringify(metadata),
//   ];
//   console.log("Executing SQL:", sql, "with values:", vals);
//   const res = await query(sql, vals);
//   console.log("Task created:", res.rows[0]);
//   return res.rows[0];
// }

// /**
//  * Get task by id
//  */
// export async function getTaskById(taskId) {
//   const res = await query("SELECT * FROM tasks WHERE id = $1", [taskId]);
//   console.log("getTaskById result for id", taskId, ":", res.rows[0]);
//   return res.rows[0] || null;
// }

// /**
//  * Update task fields; `updates` is an object of allowed fields.
//  */
// export async function updateTask(taskId, updates = {}) {
//   // Build dynamic SET clause
//   const allowed = [
//     "title",
//     "description",
//     "assignee_id",
//     "status",
//     "priority",
//     "due_date",
//     "project_id",
//     "tags",
//     "metadata",
//   ];

//   const setParts = [];
//   const vals = [];
//   let idx = 1;
//   for (const key of allowed) {
//     if (key in updates) {
//       setParts.push(`${key} = $${idx}`);
//       if (key === "tags" || key === "metadata") {
//         vals.push(JSON.stringify(updates[key]));
//       } else {
//         vals.push(updates[key]);
//       }
//       idx++;
//     }
//   }

//   if (setParts.length === 0) {
//     // nothing to update
//     const existing = await getTaskById(taskId);
//     return existing;
//   }

//   // updated_at
//   setParts.push(`updated_at = now()`);

//   const sql = `UPDATE tasks SET ${setParts.join(", ")} WHERE id = $${idx} RETURNING *;`;
//   vals.push(taskId);

//   const res = await query(sql, vals);
//   return res.rows[0];
// }

// /**
//  * List tasks with basic filtering and pagination
//  * filters: { assigneeId, status, projectId, createdBy, search, limit, offset }
//  */
// export async function listTasks(filters = {}) {
//   const clauses = [];
//   const vals = [];
//   let idx = 1;

//   if (filters.assigneeId) {
//     clauses.push(`assignee_id = $${idx++}`);
//     vals.push(filters.assigneeId);
//   }
//   if (filters.status) {
//     clauses.push(`status = $${idx++}`);
//     vals.push(filters.status.trim());
//   }
//   if (filters.projectId) {
//     clauses.push(`project_id = $${idx++}`);
//     vals.push(filters.projectId);
//   }
//   if (filters.createdBy) {
//     clauses.push(`created_by = $${idx++}`);
//     vals.push(filters.createdBy);
//   }
//   if (filters.search) {
//     clauses.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
//     vals.push(`%${filters.search}%`);
//     idx++;
//   }

//   const limit = parseInt(filters.limit, 10) || 50;
//   const offset = parseInt(filters.offset, 10) || 0;

//   const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
//   const sql = `SELECT * FROM tasks ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
//   vals.push(limit, offset);

//     console.log("Executing SQL:", sql, "with values:", vals);

//   const res = await query(sql, vals);
//   console.log("listTasks:", res.rows);
//   return res.rows;
// }

// /**
//  * Delete a task by id
//  */
// export async function deleteTask(taskId) {
//   const sql = `DELETE FROM tasks WHERE id = $1 RETURNING *;`;
//   const res = await query(sql, [taskId]);
//   console.log("Task deleted:", res.rows[0]);
//   return res.rows[0] || null;
// }




import { query } from "../lib/db.js";

/**
 * Create a new task
 */
export async function createTask({
  title,
  description = null,
  projectId,
  assigneeId = null,
  createdBy,
  status = "Backlog",
  priority = "Medium",
  dueDate = null,
  tags = [],
  metadata = {},
}) {
  const sql = `
    INSERT INTO tasks
      (title, description, project_id, assignee_id, created_by, status, priority, due_date, tags, metadata)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `;

  const vals = [
    title,
    description,
    projectId,
    assigneeId,
    createdBy,
    status,
    priority,
    dueDate,
    JSON.stringify(tags),
    JSON.stringify(metadata),
  ];

  const res = await query(sql, vals);
  return res.rows[0];
}

/**
 * Get task by id
 */
export async function getTaskById(taskId) {
  const res = await query("SELECT * FROM tasks WHERE id = $1", [taskId]);
  return res.rows[0] || null;
}

/**
 * Update task
 */
export async function updateTask(taskId, updates = {}) {
  const allowed = [
    "title",
    "description",
    "assignee_id",
    "status",
    "priority",
    "due_date",
    "project_id",
    "tags",
    "metadata",
  ];

  const setParts = [];
  const vals = [];
  let idx = 1;

  for (const key of allowed) {
    if (key in updates) {
      setParts.push(`${key} = $${idx}`);
      vals.push(
        key === "tags" || key === "metadata"
          ? JSON.stringify(updates[key])
          : updates[key]
      );
      idx++;
    }
  }

  if (!setParts.length) {
    return await getTaskById(taskId);
  }

  setParts.push("updated_at = now()");
  vals.push(taskId);

  const sql = `
    UPDATE tasks
    SET ${setParts.join(", ")}
    WHERE id = $${idx}
    RETURNING *;
  `;

  const res = await query(sql, vals);
  return res.rows[0];
}

/**
 * List tasks
 */
// export async function listTasks(filters = {}) {
//   const clauses = [];
//   const vals = [];
//   let idx = 1;

//   if (filters.assigneeId) {
//     clauses.push(`assignee_id = $${idx++}`);
//     vals.push(filters.assigneeId);
//   }
//   if (filters.status) {
//     clauses.push(`status = $${idx++}`);
//     vals.push(filters.status.trim());
//   }
//   if (filters.projectId) {
//     clauses.push(`project_id = $${idx++}`);
//     vals.push(filters.projectId);
//   }
//   if (filters.createdBy) {
//     clauses.push(`created_by = $${idx++}`);
//     vals.push(filters.createdBy);
//   }
//   if (filters.search) {
//     clauses.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
//     vals.push(`%${filters.search}%`);
//     idx++;
//   }

//   const limit = parseInt(filters.limit, 10) || 50;
//   const offset = parseInt(filters.offset, 10) || 0;

//   const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

//   const sql = `
//     SELECT * FROM tasks
//     ${where}
//     ORDER BY created_at DESC
//     LIMIT $${idx++} OFFSET $${idx++}
//   `;

//   vals.push(limit, offset);

//   const res = await query(sql, vals);
//   return res.rows;
// }


// Update the listTasks function in taskHandlers.js or taskService.js
export async function listTasks(filters = {}) {
  const clauses = [];
  const vals = [];
  let idx = 1;

  if (filters.assigneeId) {
    clauses.push(`t.assignee_id = $${idx++}`);
    vals.push(filters.assigneeId);
  }
  if (filters.status) {
    clauses.push(`t.status = $${idx++}`);
    vals.push(filters.status.trim());
  }
  if (filters.projectId) {
    clauses.push(`t.project_id = $${idx++}`);
    vals.push(filters.projectId);
  }
  if (filters.createdBy) {
    clauses.push(`t.created_by = $${idx++}`);
    vals.push(filters.createdBy);
  }
  if (filters.search) {
    clauses.push(`(t.title ILIKE $${idx} OR t.description ILIKE $${idx})`);
    vals.push(`%${filters.search}%`);
    idx++;
  }

  const limit = parseInt(filters.limit, 10) || 50;
  const offset = parseInt(filters.offset, 10) || 0;

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  // Updated SQL to include assignee details
  const sql = `
    SELECT 
      t.*,
      u.id as assignee_user_id,
      u.full_name as assignee_name,
      u.email as assignee_email,
      uc.id as creator_user_id,
      uc.full_name as creator_name
    FROM tasks t
    LEFT JOIN users u ON u.id = t.assignee_id
    LEFT JOIN users uc ON uc.id = t.created_by
    ${where}
    ORDER BY t.created_at DESC
    LIMIT $${idx++} OFFSET $${idx++}
  `;

  vals.push(limit, offset);

  const res = await query(sql, vals);
  
  // Format the response to include assignee info
  return res.rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    due_date: row.due_date,
    assignee_id: row.assignee_id,
    assignee_name: row.assignee_name,
    assignee_email: row.assignee_email,
    created_by: row.created_by,
    creator_name: row.creator_name,
    project_id: row.project_id,
    tags: row.tags,
    metadata: row.metadata,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
}



/**
 * Delete task
 */
export async function deleteTask(taskId) {
  const res = await query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *;",
    [taskId]
  );
  return res.rows[0] || null;
}
