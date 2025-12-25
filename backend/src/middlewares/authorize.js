import { getAllowedModules } from "../services/accessPolicy.js";
import { errorResponse } from "../utils/responses.js";

/**
 * authorize("TASKS") → checks if user role can access TASKS module
 */
export function authorize(moduleId) {
  return (req, res, next) => {
    const allowed = getAllowedModules(req.user.role);

    if (!allowed.includes(moduleId) && !allowed.includes("ALL")) {
      return errorResponse(res, 403, "FORBIDDEN", `Access denied to module: ${moduleId}`);
    }

    next();
  };
}
