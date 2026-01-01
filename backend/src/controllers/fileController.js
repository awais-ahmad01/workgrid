// import { errorResponse, successResponse } from "../utils/responses.js";
// import { createUploadUrl, confirmFile, listFiles, deleteFile } from "../services/fileService.js";
// import { canViewTask, isHighRole } from "../services/permissionService.js";
// import { getTaskById } from "../services/taskService.js";

// // export async function handshakeFile(req, res) {
// //   try {
// //     const actor = req.user;
// //     const taskId = req.params.id;
// //     const { fileName, fileType, fileSize } = req.body || {};

// //     if (!fileName || !fileType) {
// //       return errorResponse(res, 400, "VALIDATION_ERROR", "fileName and fileType are required");
// //     }

// //     const task = await getTaskById(taskId);
// //     if (!task) return errorResponse(res, 404, "NOT_FOUND", "Task not found");
// //     if (!canViewTask(actor.role, task, actor.userId)) {
// //       return errorResponse(res, 403, "FORBIDDEN", "You cannot attach files to this task");
// //     }

// //     const upload = await createUploadUrl({ taskId, userId: actor.userId, fileName, fileType, fileSize });
// //     return successResponse(res, upload);
// //   } catch (err) {
// //     console.error("handshakeFile error:", err);
// //     return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to create upload URL");
// //   }
// // }



// export async function projectFileHandshake(req, res) {
//   const { projectId } = req.params;
//   const { fileName } = req.body;

//   const upload = await createUploadUrl({
//     projectId,
//     fileName
//   });

//   return successResponse(res, upload);
// }



// export async function taskFileHandshake(req, res) {
//   const { taskId } = req.params;
//   const task = await getTaskById(taskId);

//   const upload = await createUploadUrl({
//     projectId: task.project_id,
//     taskId,
//     fileName: req.body.fileName
//   });

//   return successResponse(res, upload);
// }







// export async function confirmFileUpload(req, res) {
//   try {
//     const actor = req.user;
//     const taskId = req.params.id;
//     const { path, fileName, mimeType, size } = req.body || {};

//     if (!path || !fileName) {
//       return errorResponse(res, 400, "VALIDATION_ERROR", "path and fileName are required");
//     }

//     const task = await getTaskById(taskId);
//     if (!task) return errorResponse(res, 404, "NOT_FOUND", "Task not found");
//     if (!canViewTask(actor.role, task, actor.userId)) {
//       return errorResponse(res, 403, "FORBIDDEN", "You cannot attach files to this task");
//     }

//     const file = await confirmFile({
//       taskId,
//       userId: actor.userId,
//       path,
//       fileName,
//       mimeType,
//       size,
//     });
//     return successResponse(res, { file }, 201);
//   } catch (err) {
//     console.error("confirmFileUpload error:", err);
//     return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to confirm file");
//   }
// }

// export async function getFiles(req, res) {
//   try {
//     const actor = req.user;
//     const taskId = req.params.id;
//     const task = await getTaskById(taskId);
//     if (!task) return errorResponse(res, 404, "NOT_FOUND", "Task not found");
//     if (!canViewTask(actor.role, task, actor.userId)) {
//       return errorResponse(res, 403, "FORBIDDEN", "You cannot view files for this task");
//     }
//     const files = await listFiles({ taskId });
//     return successResponse(res, { files });
//   } catch (err) {
//     console.error("getFiles error:", err);
//     return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to fetch files");
//   }
// }

// export async function deleteFileController(req, res) {
//   try {
//     const actor = req.user;
//     const fileId = req.params.fileId;
//     const isHigh = isHighRole(actor.role);
//     const deleted = await deleteFile({ fileId, userId: actor.userId, isHighRole: isHigh });
//     return successResponse(res, { deleted });
//   } catch (err) {
//     console.error("deleteFile error:", err);
//     if (err.code === "FORBIDDEN") {
//       return errorResponse(res, 403, "FORBIDDEN", "You cannot delete this file");
//     }
//     return errorResponse(res, 500, "SERVER_ERROR", err.message || "Failed to delete file");
//   }
// }




import { successResponse } from "../utils/responses.js";
import {
  createUploadUrl,
  confirmFile,
  listTaskFiles,
  deleteFile,
} from "../services/fileService.js";
import { getTaskById } from "../services/taskService.js";

export async function taskFileHandshake(req, res) {
  const task = await getTaskById(req.params.taskId);
  const upload = await createUploadUrl({
    projectId: task.project_id,
    taskId: task.id,
    fileName: req.body.fileName,
  });

  return successResponse(res, upload);
}

export async function confirmTaskFileUpload(req, res) {
  const task = await getTaskById(req.params.taskId);
  const actor = req.user;

  const file = await confirmFile({
    projectId: task.project_id,
    taskId: task.id,
    userId: actor.userId,
    ...req.body,
  });

  return successResponse(res, { file }, 201);
}

export async function getTaskFiles(req, res) {
  const files = await listTaskFiles({ taskId: req.params.taskId });
  return successResponse(res, { files });
}

export async function deleteTaskFile(req, res) {
  const deleted = await deleteFile({ fileId: req.params.fileId });
  return successResponse(res, { deleted });
}







