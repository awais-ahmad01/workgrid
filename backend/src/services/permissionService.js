/**
 * permissionService
 *
 * Encapsulates role-aware permission checks for task operations.
 *
 * Roles from roleResolver: ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_HR,
 * ROLE_TEAM_LEAD, ROLE_SENIOR_INTERN, ROLE_INTERN
 */

export function isHighRole(role) {
  return ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_HR", "ROLE_TEAM_LEAD"].includes(role);
}

export function isContributingRole(role) {
  return ["ROLE_SENIOR_INTERN"].includes(role) || isHighRole(role);
}

export function canCreateTask(role) {
  // Only higher roles (management) create tasks
  return isHighRole(role);
}

export function canAssignTask(role) {
  // Only higher roles and team leads can assign
  return isHighRole(role);
}

export function canUpdateTask(role, task, userId) {
  // Higher roles can update any task
  if (isHighRole(role)) return true;

  // Senior intern: can update tasks related to them (assignee)
  if (role === "ROLE_SENIOR_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Intern: only update status of tasks assigned to them
  if (role === "ROLE_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  return false;
}

export function canViewTask(role, task, userId) {
  // Higher roles: see all
  if (isHighRole(role)) return true;

  // Senior intern: see tasks assigned to them
  if (role === "ROLE_SENIOR_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Intern: only see tasks assigned to them
  if (role === "ROLE_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Default deny
  return false;
}

export function canDeleteTask(role, task, userId) {
  // Higher roles can delete any task
  if (isHighRole(role)) return true;

  // Senior intern: can delete tasks they created or are assigned to
  if (role === "ROLE_SENIOR_INTERN") {
    return task && (
      String(task.created_by) === String(userId) ||
      String(task.assignee_id) === String(userId)
    );
  }

  // Intern: cannot delete tasks
  return false;
}