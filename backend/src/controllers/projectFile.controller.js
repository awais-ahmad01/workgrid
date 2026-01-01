import { successResponse } from "../utils/responses.js";
import {
  createUploadUrl,
  confirmFile,
  listProjectFiles,
  deleteFile,
} from "../services/fileService.js";

export async function projectFileHandshake(req, res) {
  const { projectId } = req.params;
  const { fileName } = req.body;

  const upload = await createUploadUrl({ projectId, fileName });
  return successResponse(res, upload);
}

export async function confirmProjectFileUpload(req, res) {
  const { projectId } = req.params;
  const actor = req.user;
  const { path, fileName, mimeType, size } = req.body;

  const file = await confirmFile({
    projectId,
    userId: actor.userId,
    path,
    fileName,
    mimeType,
    size,
  });

  return successResponse(res, { file }, 201);
}

export async function getProjectFiles(req, res) {
  const files = await listProjectFiles({ projectId: req.params.projectId });
  return successResponse(res, { files });
}

export async function deleteProjectFile(req, res) {
  const deleted = await deleteFile({ fileId: req.params.fileId });
  return successResponse(res, { deleted });
}
