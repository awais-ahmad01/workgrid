// import { supabase } from "../lib/supabase.js";

// // const BUCKET = "task-files";

// // async function ensureBucket() {
// //   const { data, error } = await supabase.storage.getBucket(BUCKET);
// //   if (error && error.message && !error.message.includes("not found")) {
// //     throw error;
// //   }
// //   if (!data) {
// //     const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
// //       public: true,
// //       fileSizeLimit: 50 * 1024 * 1024, // 50MB limit; adjust as needed
// //     });
// //     if (createErr) throw createErr;
// //   }
// // }

// // export async function createUploadUrl({ taskId, userId, fileName, fileType, fileSize }) {
// //   await ensureBucket();

// //   const path = `${taskId}/${Date.now()}-${fileName}`;

// //   const { data, error } = await supabase.storage
// //     .from(BUCKET)
// //     .createSignedUploadUrl(path);

// //   if (error) throw error;

// //   return { url: data.signedUrl, path, token: data.token };
// // }


// const BUCKET = "project-files";

// export async function createUploadUrl({
//   projectId,
//   taskId = null,
//   fileName
// }) {
//   const folder = taskId ? `tasks/${taskId}` : `project`;
//   const path = `${projectId}/${folder}/${Date.now()}-${fileName}`;

//   const { data, error } = await supabase.storage
//     .from(BUCKET)
//     .createSignedUploadUrl(path);

//   if (error) throw error;

//   return { url: data.signedUrl, path };
// }



// // export async function confirmFile({ taskId, userId, path, fileName, mimeType, size }) {
// //   const { data, error } = await supabase
// //     .from("task_files")
// //     .insert({
// //       task_id: taskId,
// //       user_id: userId,
// //       file_path: path,
// //       file_name: fileName,
// //       mime_type: mimeType,
// //       size,
// //     })
// //     .select()
// //     .single();
// //   if (error) throw error;
// //   return data;
// // }


// export async function confirmFile({
//   projectId,
//   taskId,
//   userId,
//   path,
//   fileName,
//   mimeType,
//   size
// }) {
//   const { data, error } = await supabase
//     .from("project_files")
//     .insert({
//       project_id: projectId,
//       task_id: taskId,
//       user_id: userId,
//       file_path: path,
//       file_name: fileName,
//       mime_type: mimeType,
//       size
//     })
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }




// export async function listProjectFiles({ projectId }) {
//   const { data, error } = await supabase
//     .from("project_files")
//     .select("*")
//     .eq("project_id", projectId)
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data;
// }


// export async function listTaskFiles({ taskId }) {
//   const { data, error } = await supabase
//     .from("project_files")
//     .select("*")
//     .eq("task_id", taskId)
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data;
// }







// // export async function listFiles({ taskId }) {
// //   const { data, error } = await supabase
// //     .from("task_files")
// //     .select("*")
// //     .eq("task_id", taskId)
// //     .order("created_at", { ascending: false });
// //   if (error) throw error;
// //   return data;
// // }





// export async function deleteFile({ fileId, userId, isHighRole }) {
//   // Fetch file to get path and owner
//   const { data: file, error: fetchErr } = await supabase
//     .from("task_files")
//     .select("*")
//     .eq("id", fileId)
//     .single();
//   if (fetchErr) throw fetchErr;
//   if (!file) throw new Error("FILE_NOT_FOUND");

//   // Only owner or high role can delete
//   if (!isHighRole && String(file.user_id) !== String(userId)) {
//     const err = new Error("FORBIDDEN");
//     err.code = "FORBIDDEN";
//     throw err;
//   }

//   const { error: storageErr } = await supabase.storage
//     .from(BUCKET)
//     .remove([file.file_path]);
//   if (storageErr) throw storageErr;

//   const { error: deleteErr } = await supabase
//     .from("task_files")
//     .delete()
//     .eq("id", fileId);
//   if (deleteErr) throw deleteErr;

//   return file;
// }




import { supabase } from "../lib/supabase.js";

const BUCKET = "project-files";

/* ---------------- BUCKET ---------------- */
async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024,
    });
  }
}

/* ---------------- UPLOAD URL ---------------- */
export async function createUploadUrl({
  projectId,
  taskId = null,
  docId = null,
  fileName,
}) {
  await ensureBucket();

  const folder = taskId ? `tasks/${taskId}` : docId ? `docs/${docId}` : `project`;
  const path = `${projectId}/${folder}/${Date.now()}-${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error) throw error;
  return { url: data.signedUrl, path };
}

/* ---------------- CONFIRM ---------------- */
export async function confirmFile({
  projectId,
  taskId = null,
  docId = null,
  userId,
  path,
  fileName,
  mimeType,
  size,
}) {
  console.log("confirmFile called with:", {
    projectId,
    taskId,
    docId,
    userId,
    path,
    fileName,
    mimeType,
    size,
  });
  const { data, error } = await supabase
    .from("project_files")
    .insert({
      project_id: projectId,
      task_id: taskId,
      doc_id: docId,
      user_id: userId,
      file_path: path,
      file_name: fileName,
      mime_type: mimeType,
      size,
    })
    .select()
    .single();

  if (error){
    console.log("confirmFile error:", error);
    throw error;
  };
  return data;
}

/* ---------------- LIST ---------------- */
export async function listProjectFiles({ projectId }) {
  const { data, error } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function listTaskFiles({ taskId }) {
  const { data, error } = await supabase
    .from("project_files")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/* ---------------- DELETE ---------------- */
export async function deleteFile({ fileId }) {
  const { data: file } = await supabase
    .from("project_files")
    .select("*")
    .eq("id", fileId)
    .single();

  await supabase.storage.from(BUCKET).remove([file.file_path]);
  await supabase.from("project_files").delete().eq("id", fileId);

  return file;
}



