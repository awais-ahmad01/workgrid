import { successResponse } from "../utils/responses.js";
import {
  createUploadUrl,
  confirmFile,
  deleteFile,
  listProjectFiles,
} from "../services/fileService.js";
import {getDocById} from "../services/docService.js";

export async function docFileHandshake(req, res) {
  const { projectId, docId } = req.params;
  console.log("docFileHandshake called with:", { projectId, docId, body: req.body });

  const doc = await getDocById(docId);

  if (doc.project_id !== projectId) {
    return res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Document not found in the specified project",
        }
    });
  }

  const upload = await createUploadUrl({
    projectId,
    docId,
    fileName: req.body.fileName,
  });

  console.log("Generated upload URL:", upload);

  return successResponse(res, upload);
}

export async function confirmDocFileUpload(req, res) {
  const actor = req.user;
  const { projectId, docId } = req.params;
  const { path, fileName, mimeType, size } = req.body;
    console.log("confirmDocFileUpload called with:", { projectId, docId, body: req.body });

  const file = await confirmFile({
    projectId,
    docId,
    userId: actor.userId,
    path,
    fileName,
    mimeType,
    size,
  });

  console.log("Confirmed file upload:", file);

  return successResponse(res, { file }, 201);
}

export async function getDocFiles(req, res) {
  const files = await listProjectFiles({ projectId: req.params.projectId });
  const filtered = files.filter((f) => f.doc_id === req.params.docId);
  return successResponse(res, { files: filtered });
}

export async function deleteDocFile(req, res) {
  const deleted = await deleteFile({ fileId: req.params.fileId });
  return successResponse(res, { deleted });
}
