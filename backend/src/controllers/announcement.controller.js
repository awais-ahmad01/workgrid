import { successResponse } from "../utils/responses.js";
import {
  createAnnouncement,
  listAnnouncementsForUser,
  markAnnouncementRead,
  deleteAnnouncement,
  togglePinAnnouncement,
} from "../services/announcement.service.js";

/* CREATE */
export async function createAnnouncementController(req, res) {
  const actor = req.user;
  const { title, body, category, targets, pinned } = req.body;

  if (!["SUPER_ADMIN", "ADMIN", "HR", "TEAM_LEAD"].includes(actor.role)) {
    return res.status(403).json({
      message: "You are not authorized to create announcements",
    });
}

  const announcement = await createAnnouncement({
    title,
    body,
    category,
    targets,
    pinned,
    createdBy: actor.userId,
    organizationId: actor.orgId,
  });

  return successResponse(res, { announcement }, 201);
}

/* LIST FOR USER */
// export async function getAnnouncements(req, res) {
//   const actor = req.user;

//   const { category, fromDate } = req.query;

//   const announcements = await listAnnouncementsForUser({
//     userId: actor.userId,
//     role: actor.role,
//     projectIds: actor.projectIds || [],
//     filters: { category, fromDate },
//   });

//   return successResponse(res, { announcements });
// }



export async function getAnnouncements(req, res) {
  const actor = req.user
  const { category, fromDate, projectIds } = req.query

  const parsedProjectIds = Array.isArray(projectIds)
    ? projectIds
    : projectIds
    ? [projectIds]
    : []

  const announcements = await listAnnouncementsForUser({
    userId: actor.userId,
    role: actor.role,
    projectIds: parsedProjectIds,
    filters: { category, fromDate },
  })

  return successResponse(res, { announcements })
}




/* MARK READ */
export async function markRead(req, res) {
  const actor = req.user;
  await markAnnouncementRead({
    announcementId: req.params.id,
    userId: actor.userId,
  });

  return successResponse(res, { success: true });
}

/* PIN */
export async function pinAnnouncement(req, res) {
  const { pinned } = req.body;

  const updated = await togglePinAnnouncement({
    announcementId: req.params.id,
    pinned,
  });

  return successResponse(res, { announcement: updated });
}

/* DELETE */
export async function deleteAnnouncementController(req, res) {
  const deleted = await deleteAnnouncement({
    announcementId: req.params.id,
  });

  return successResponse(res, { deleted });
}
