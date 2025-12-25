import { errorResponse, successResponse } from "../utils/responses.js";
import { createComment, listComments } from "../services/commentService.js";
import { canViewTask } from "../services/permissionService.js";
import { getTaskById } from "../services/taskService.js";
import { createNotification } from "../services/notificationService.js";
import { query } from "../lib/db.js";

// Simple mention parse: finds @Name tokens (alphanum/underscore)
function extractMentions(body) {
  const matches = body.match(/@([A-Za-z0-9_]+)/g) || [];
  return [...new Set(matches.map((m) => m.replace("@", "")))].map((m) => m.toLowerCase());
}

export async function postComment(req, res) {
  try {
    const actor = req.user;
    const taskId = req.params.id;
    const { body } = req.body;

    if (!body || typeof body !== "string") {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Comment body is required");
    }

    const task = await getTaskById(taskId);
    if (!task) return errorResponse(res, 404, "NOT_FOUND", "Task not found");

    if (!canViewTask(actor.role, task, actor.id)) {
      return errorResponse(res, 403, "FORBIDDEN", "You cannot comment on this task");
    }

    const mentionNames = extractMentions(body);
    let mentionedUsers = [];

    if (mentionNames.length) {
      // Resolve mentions to user ids by several variants (case-insensitive)
      // - full name lower
      // - first token of name
      // - email username (before @)
      // - name with spaces removed
      const sql = `
        SELECT id, name, email
        FROM "user"
        WHERE lower(name) = ANY($1)
           OR lower(split_part(name, ' ', 1)) = ANY($1)
           OR lower(split_part(email, '@', 1)) = ANY($1)
           OR lower(regexp_replace(name, '\\s+', '', 'g')) = ANY($1)
      `;
      const resp = await query(sql, [mentionNames]);
      mentionedUsers = resp.rows || [];
    }

    const mentionIds = mentionedUsers.map((u) => u.id);

    const comment = await createComment({
      taskId,
      userId: actor.id,
      body,
      mentions: mentionIds,
    });

    // Notify mentioned users (no self, no duplicate comment notification)
    for (const mu of mentionedUsers) {
      if (String(mu.id) === String(actor.id)) continue; // don't notify self
      await createNotification({
        userId: mu.id,
        type: "MENTION",
        taskId,
        commentId: comment.id,
        meta: { mentions: mentionNames, author: { id: actor.id, name: actor.name }, taskTitle: task.title },
      }).catch(() => {});
    }

    return successResponse(res, { comment }, 201);
  } catch (err) {
    console.error("postComment error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to post comment");
  }
}

export async function getComments(req, res) {
  try {
    const actor = req.user;
    const taskId = req.params.id;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;

    const task = await getTaskById(taskId);
    if (!task) return errorResponse(res, 404, "NOT_FOUND", "Task not found");
    if (!canViewTask(actor.role, task, actor.id)) {
      return errorResponse(res, 403, "FORBIDDEN", "You cannot view comments for this task");
    }

    const comments = await listComments({ taskId, limit, offset });
    return successResponse(res, { comments });
  } catch (err) {
    console.error("getComments error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to fetch comments");
  }
}

