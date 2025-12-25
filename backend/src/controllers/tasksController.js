import {
  createTask,
  getTaskById,
  updateTask,
  listTasks,
  deleteTask,
} from "../services/taskService.js";
import {
  canCreateTask,
  canAssignTask,
  canUpdateTask,
  canViewTask,
  canDeleteTask,
} from "../services/permissionService.js";
import { logActivity } from "../services/activityService.js";
import { errorResponse } from "../utils/responses.js";

/**
 * POST /tasks
 * Body:
 *  - title (required)
 *  - description
 *  - assigneeId
 *  - priority
 *  - dueDate
 *  - projectId
 *  - tags (array)
 */
export async function createTaskHandler(req, res) {
  const actor = req.user;
  const body = req.body;

  console.log("createTaskHandler invoked by user:", actor.id, "with body:", body);

  if (!canCreateTask(actor.role)) {
    return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to create tasks");
  }

  if (!body.title || typeof body.title !== "string") {
    return errorResponse(res, 400, "INVALID_INPUT", "Task title is required");
  }

  // If assignee provided and the actor cannot assign, reject
  if (body.assigneeId && !canAssignTask(actor.role)) {
    return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to assign tasks");
  }

  try {
    console.log("Creating task with title:", body.title);
    const task = await createTask({
      title: body.title,
      description: body.description || null,
      assigneeId: body.assigneeId || null,
      createdBy: actor.id,
      status: body.status || "Backlog",
      priority: body.priority || "Medium",
      dueDate: body.dueDate || null,
      projectId: body.projectId || null,
      tags: body.tags || [],
      metadata: body.metadata || {},
    });

    // Log activity: created
    await logActivity({
      taskId: task.id,
      userId: actor.id,
      action: "created",
      field: null,
      oldValue: null,
      newValue: JSON.stringify(task),
    });

    return res.status(201).json({ status: "success", task });
  } catch (err) {
    console.error("createTaskHandler error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", "Failed to create task");
  }
}

/**
 * GET /tasks
 * Query params: assigneeId, status, projectId, createdBy, search, limit, offset
 * Role-aware: high roles see everything; others filtered by their visibility rules
 */
export async function listTasksHandler(req, res) {

  const actor = req.user;

  console.log("listTasksHandler invoked by user:", actor.id, "with role:", actor.role);

  const filters = {
    assigneeId: req.query.assigneeId,
    status: req.query.status,
    projectId: req.query.projectId,
    createdBy: req.query.createdBy,
    search: req.query.search,
    limit: req.query.limit,
    offset: req.query.offset,
  };

  try {
    // For restricted roles, if no filters provided, return tasks for that user only
    if (!canViewTask(actor.role, { assignee_id: actor.id }, actor.id) && !["ROLE_SUPER_ADMIN","ROLE_ADMIN","ROLE_HR","ROLE_TEAM_LEAD"].includes(actor.role)) {
      // If the user is intern or senior intern, only show their own tasks
      filters.assigneeId = actor.id;
    } else if (["ROLE_SENIOR_INTERN", "ROLE_INTERN"].includes(actor.role)) {
      filters.assigneeId = actor.id;
    }

    const tasks = await listTasks(filters);
    return res.json({ status: "success", tasks });
  } catch (err) {
    console.error("listTasksHandler error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", "Failed to list tasks");
  }
}

/**
 * GET /tasks/:id
 */
export async function getTaskHandler(req, res) {
  const actor = req.user;
  const taskId = req.params.id;

  console.log("getTaskHandler invoked by user:", actor.id, "for taskId:", taskId);

  try {
    const task = await getTaskById(taskId);
    if (!task) {
      return errorResponse(res, 404, "NOT_FOUND", "Task not found");
    }

    // Check visibility
    if (!canViewTask(actor.role, task, actor.id)) {
      return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to view this task");
    }

    return res.json({ status: "success", task });
  } catch (err) {
    console.error("getTaskHandler error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", "Failed to fetch task");
  }
}

/**
 * PATCH /tasks/:id
 * Body may contain: title, description, assigneeId, status, priority, dueDate, tags, metadata
 *
 * Permission rules enforced in canUpdateTask
 */
export async function updateTaskHandler(req, res) {
  const actor = req.user;
  const taskId = req.params.id;
  const body = req.body;

  try {
    const task = await getTaskById(taskId);
    if (!task) {
      return errorResponse(res, 404, "NOT_FOUND", "Task not found");
    }

    // Check permission to update
    if (!canUpdateTask(actor.role, task, actor.id)) {
      return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to update this task");
    }

    // Determine changes for activity logs
    const before = { ...task };

    // Prepare updates only for allowed fields
    const updates = {};
    const allowedFields = {
      title: "title",
      description: "description",
      assigneeId: "assignee_id",
      status: "status",
      priority: "priority",
      dueDate: "due_date",
      projectId: "project_id",
      tags: "tags",
      metadata: "metadata",
    };

    for (const k of Object.keys(body || {})) {
      if (k in allowedFields) {
        // map assigneeId -> assignee_id etc
        const mapped = allowedFields[k];
        updates[mapped] = body[k];
      }
    }

    const updated = await updateTask(taskId, updates);

    // Create activity logs for each changed field
    for (const fieldKey of Object.keys(updates)) {
      const oldVal = before[fieldKey];
      let newVal = updates[fieldKey];
      // Normalize json fields
      if (fieldKey === "tags" || fieldKey === "metadata") {
        try {
          newVal = JSON.stringify(newVal);
        } catch (e) {}
      }

      await logActivity({
        taskId,
        userId: actor.id,
        action: "updated",
        field: fieldKey,
        oldValue: oldVal === null ? null : String(oldVal),
        newValue: newVal === null ? null : String(newVal),
      });
    }

    return res.json({ status: "success", task: updated });
  } catch (err) {
    console.error("updateTaskHandler error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", "Failed to update task");
  }
}

/**
 * GET /tasks/:id/activity
 * Returns activity log for the task ordered by created_at desc
 */
export async function getTaskActivityHandler(req, res) {
  const actor = req.user;
  const taskId = req.params.id;

  try {
    const task = await getTaskById(taskId);
    if (!task) {
      return errorResponse(res, 404, "NOT_FOUND", "Task not found");
    }

    // Check visibility
    if (!canViewTask(actor.role, task, actor.id)) {
      return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to view activity for this task");
    }

    const { query } = await import("../lib/db.js");
    const sql = `SELECT * FROM task_activity WHERE task_id = $1 ORDER BY created_at DESC`;
    const resDb = await query(sql, [taskId]);
    const activities = resDb.rows;

    return res.json({ status: "success", activities });
  } catch (err) {
    console.error("getTaskActivityHandler error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", "Failed to fetch activity");
  }
}

/**
 * DELETE /tasks/:id
 * Deletes a task if the user has permission
 */
export async function deleteTaskHandler(req, res) {
  const actor = req.user;
  const taskId = req.params.id;

  console.log("deleteTaskHandler invoked by user:", actor.id, "for taskId:", taskId);

  try {
    const task = await getTaskById(taskId);
    if (!task) {
      return errorResponse(res, 404, "NOT_FOUND", "Task not found");
    }

    // Check permission to delete
    if (!canDeleteTask(actor.role, task, actor.id)) {
      return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to delete this task");
    }

    // Log activity before deletion
    await logActivity({
      taskId: task.id,
      userId: actor.id,
      action: "deleted",
      field: null,
      oldValue: JSON.stringify(task),
      newValue: null,
    });

    // Delete the task
    const deleted = await deleteTask(taskId);

    if (!deleted) {
      return errorResponse(res, 500, "SERVER_ERROR", "Failed to delete task");
    }

    return res.json({ status: "success", message: "Task deleted successfully" });
  } catch (err) {
    console.error("deleteTaskHandler error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", "Failed to delete task");
  }
}
