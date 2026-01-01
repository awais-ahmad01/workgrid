import { successResponse } from "../utils/responses.js";
import {
  createDoc,
  listDocs,
  getDocById,
  updateDoc,
  deleteDoc,
} from "../services/docService.js";

/* CREATE */
export async function createProjectDoc(req, res) {
  const actor = req.user;
  const { projectId } = req.params;
  const { title, content } = req.body;

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

  const doc = await updateDoc({
    docId: req.params.docId,
    title,
    content,
    userId: actor.userId,
  });

  return successResponse(res, { doc });
}

/* DELETE */
export async function deleteProjectDoc(req, res) {
  const deleted = await deleteDoc({ docId: req.params.docId });
  return successResponse(res, { deleted });
}
