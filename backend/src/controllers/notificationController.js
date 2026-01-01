import { errorResponse, successResponse } from "../utils/responses.js";
import { listNotifications, markNotificationRead, markAllRead } from "../services/notificationService.js";

export async function getNotifications(req, res) {
  try {
    const userId = req.user.userId;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset, 10) || 0;
    const notifications = await listNotifications({ userId, limit, offset });
    return successResponse(res, { notifications });
  } catch (err) {
    console.error("getNotifications error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to fetch notifications");
  }
}

export async function markRead(req, res) {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.id;
    const notification = await markNotificationRead({ notificationId, userId });
    return successResponse(res, { notification });
  } catch (err) {
    console.error("markRead error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to mark as read");
  }
}

export async function markAllReadController(req, res) {
  try {
    const userId = req.user.userId;
    const updated = await markAllRead({ userId });
    return successResponse(res, { updated });
  } catch (err) {
    console.error("markAllRead error:", err);
    return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to mark all as read");
  }
}

