import { supabase } from "../lib/supabase.js";
import { query } from "../lib/db.js";

export async function createComment({ taskId, userId, body, mentions = [] }) {
  const { data, error } = await supabase
    .from("task_comments")
    .insert({
      task_id: taskId,
      user_id: userId,
      body,
      mentions,
    })
    .select()
    .single();
  if (error) throw error;
  
  // Fetch user name to include in response
  // Cast userId to text to match user.id type
  const userResult = await query('SELECT name FROM "user" WHERE id = $1::text', [userId]);
  const userName = userResult.rows[0]?.name || 'Unknown';
  
  return {
    ...data,
    user_name: userName,
  };
}

export async function listComments({ taskId, limit = 20, offset = 0 }) {
  // First get comments
  const commentsSql = `
    SELECT *
    FROM task_comments
    WHERE task_id = $1
    ORDER BY created_at ASC
    LIMIT $2 OFFSET $3
  `;
  const commentsResult = await query(commentsSql, [taskId, limit, offset]);
  const comments = commentsResult.rows;
  
  // Then fetch user names for each unique user_id
  const userIds = [...new Set(comments.map(c => c.user_id))];
  if (userIds.length === 0) return comments;
  
  // Fetch all users at once
  const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');
  const usersSql = `SELECT id, name FROM "user" WHERE id IN (${placeholders})`;
  const usersResult = await query(usersSql, userIds);
  const userMap = new Map(usersResult.rows.map(u => [u.id, u.name]));
  
  // Attach user names to comments
  return comments.map(c => ({
    ...c,
    user_name: userMap.get(c.user_id) || userMap.get(String(c.user_id)) || 'Unknown'
  }));
}

