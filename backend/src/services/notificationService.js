import { supabase } from "../lib/supabase.js";

export async function createNotification({ userId, type, taskId, commentId = null, meta = {} }) {
  const { data, error } = await supabase
    .from("task_notifications")
    .insert({
      user_id: userId,
      type,
      task_id: taskId,
      comment_id: commentId,
      meta,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listNotifications({ userId, limit = 20, offset = 0 }) {
  const { data, error } = await supabase
    .from("task_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function markNotificationRead({ notificationId, userId }) {
  const { data, error } = await supabase
    .from("task_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markAllRead({ userId }) {
  const { data, error } = await supabase
    .from("task_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null)
    .select();
  if (error) throw error;
  return data;
}

