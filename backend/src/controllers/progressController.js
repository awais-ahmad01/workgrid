import { errorResponse, successResponse } from "../utils/responses.js";
import {
  getInternDashboard,
  getTeamLeadOverview,
  getAdminOverview,
} from "../services/progressService.js";
import { query } from "../lib/db.js";

/**
 * GET /api/progress/dashboard
 * Role-based: Returns dashboard data based on user role
 * - INTERN/SENIOR_INTERN: Personal dashboard
 * - TEAM_LEAD: Team overview
 * - ADMIN/HR/SUPER_ADMIN: High-level admin view
 */
export async function getProgressDashboard(req, res) {
  try {
    const { userId, role, orgId } = req.user;
    const organizationId = orgId; // Map orgId to organizationId for consistency
    const { projectId } = req.query;

    if (!projectId) {
      return errorResponse(
        res,
        400,
        "INVALID_INPUT",
        "projectId query parameter is required"
      );
    }

    // Verify project exists and user has access
    const projectCheck = await query(
      `
      SELECT p.id, p.organization_id
      FROM projects p
      LEFT JOIN project_members pm ON pm.project_id::uuid = p.id::uuid AND pm.user_id::uuid = $1::uuid
      WHERE p.id = $2::uuid
        AND (p.organization_id = $3::uuid OR pm.user_id::uuid = $1::uuid)
        AND p.status = 'active'
      `,
      [userId, projectId, organizationId]
    );

    if (projectCheck.rows.length === 0) {
      return errorResponse(res, 404, "NOT_FOUND", "Project not found or access denied");
    }

    console.log("proejctCheck::", projectCheck)

    let dashboardData;

    // Role-based data fetching
    // Normalize role (remove ROLE_ prefix if present)
    const normalizedRole = role.replace(/^ROLE_/, "");

    console.log("ROle:", normalizedRole)
    
    if (normalizedRole === "INTERN" || normalizedRole === "SENIOR_INTERN") {
      // Intern personal dashboard
      dashboardData = await getInternDashboard({
        userId,
        projectId,
      });
    } else if (normalizedRole === "TEAM_LEAD") {
      // Team Lead overview
      dashboardData = await getTeamLeadOverview({
        teamLeadId: userId,
        projectId,
      });
    } else if (["ADMIN", "HR", "SUPER_ADMIN"].includes(normalizedRole)) {
      // Admin/HR high-level view
      dashboardData = await getAdminOverview({
        projectId,
        organizationId,
      });
    } else {
      return errorResponse(
        res,
        403,
        "FORBIDDEN",
        "Access denied for this role"
      );
    }

    return successResponse(res, dashboardData);
  } catch (error) {
    console.error("getProgressDashboard error:", error);
    return errorResponse(
      res,
      500,
      "SERVER_ERROR",
      "Failed to fetch progress dashboard"
    );
  }
}

/**
 * GET /api/progress/workload
 * Team Lead only: Detailed workload breakdown
 */
export async function getWorkloadBreakdown(req, res) {
  try {
    const { userId, role } = req.user;
    const { projectId } = req.query;

    const normalizedRole = role.replace(/^ROLE_/, "");
    if (!["TEAM_LEAD", "ADMIN", "HR", "SUPER_ADMIN"].includes(normalizedRole)) {
      return errorResponse(
        res,
        403,
        "FORBIDDEN",
        "Only Team Leads and Admins can view workload breakdown"
      );
    }

    if (!projectId) {
      return errorResponse(
        res,
        400,
        "INVALID_INPUT",
        "projectId query parameter is required"
      );
    }

    const workloadData = await getTeamLeadOverview({
      teamLeadId: userId,
      projectId,
    });

    return successResponse(res, workloadData);
  } catch (error) {
    console.error("getWorkloadBreakdown error:", error);
    return errorResponse(
      res,
      500,
      "SERVER_ERROR",
      "Failed to fetch workload breakdown"
    );
  }
}

