import { supabase } from "../lib/supabase.js";

/* CREATE */
export async function createDoc({ projectId, title, content, userId }) {
  const { data, error } = await supabase
    .from("project_docs")
    .insert({
      project_id: projectId,
      title,
      content,
      created_by: userId,
      updated_by: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* LIST */

export async function listDocs({ projectId }) {
  const { data, error } = await supabase
    .from("project_docs")
    .select("id, title, content, updated_at, created_at")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

/* GET */
export async function getDocById(docId) {
  const { data, error } = await supabase
    .from("project_docs")
    .select("*")
    .eq("id", docId)
    .single();

  if (error) throw error;
  return data;
}

/* UPDATE */
export async function updateDoc({ docId, title, content, userId }) {
  const { data, error } = await supabase
    .from("project_docs")
    .update({
      title,
      content,
      updated_by: userId,
      updated_at: new Date(),
    })
    .eq("id", docId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/* DELETE */
export async function deleteDoc({ docId }) {
  const { data, error } = await supabase
    .from("project_docs")
    .delete()
    .eq("id", docId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
