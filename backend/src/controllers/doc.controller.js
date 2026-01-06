import { successResponse, errorResponse } from "../utils/responses.js";
import {
  createDoc,
  listDocs,
  getDocById,
  updateDoc,
  deleteDoc,
} from "../services/docService.js";
import {
  canCreateDoc,
  canUpdateDoc,
  canDeleteDoc,
} from "../services/permissionService.js";

/* CREATE */
export async function createProjectDoc(req, res) {
  const actor = req.user;
  const { projectId } = req.params;
  const { title, content } = req.body;

  if (!canCreateDoc(actor.role)) {
    return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to create documents");
  }

  const doc = await createDoc({
    projectId,
    title,
    content,
    userId: actor.userId,
  });

  return successResponse(res, { doc }, 201);
}

/* LIST */
export async function getProjectDocs(req, res) {
  const docs = await listDocs({ projectId: req.params.projectId });
  return successResponse(res, { docs });
}

/* GET */
export async function getDoc(req, res) {
  const doc = await getDocById(req.params.docId);
  return successResponse(res, { doc });
}

/* UPDATE */
export async function updateProjectDoc(req, res) {
  const actor = req.user;
  const { title, content } = req.body;
  const docId = req.params.docId;

  // Get the doc first to check permissions
  const doc = await getDocById(docId);
  if (!doc) {
    return errorResponse(res, 404, "NOT_FOUND", "Document not found");
  }

  if (!canUpdateDoc(actor.role, doc, actor.userId)) {
    return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to update this document");
  }

  const updatedDoc = await updateDoc({
    docId,
    title,
    content,
    userId: actor.userId,
  });

  return successResponse(res, { doc: updatedDoc });
}

/* DELETE */
export async function deleteProjectDoc(req, res) {
  const actor = req.user;
  const docId = req.params.docId;

  // Get the doc first to check permissions
  const doc = await getDocById(docId);
  if (!doc) {
    return errorResponse(res, 404, "NOT_FOUND", "Document not found");
  }

  if (!canDeleteDoc(actor.role, doc, actor.userId)) {
    return errorResponse(res, 403, "FORBIDDEN", "You are not allowed to delete this document");
  }

  const deleted = await deleteDoc({ docId });
  return successResponse(res, { deleted });
}
