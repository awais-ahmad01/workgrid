/**
 * permissionService
 *
 * Encapsulates role-aware permission checks for task operations.
 *
 * Roles from roleResolver: ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_HR,
 * ROLE_TEAM_LEAD, ROLE_SENIOR_INTERN, ROLE_INTERN
 */

export function isHighRole(role) {
  return ["SUPER_ADMIN", "ADMIN", "TEAM_LEAD"].includes(role);
}

export function isHR(role) {
  return role === "HR";
}

export function isContributingRole(role) {
  return ["SENIOR_INTERN"].includes(role) || isHighRole(role);
}

export function canCreateTask(role) {
  // Higher roles (management) can create tasks
  if (isHighRole(role)) return true;
  
  // Senior Interns can create tasks (to help organize tasks for interns)
  if (role === "SENIOR_INTERN") return true;
  
  // HR cannot create tasks (view-only)
  // Interns cannot create tasks
  return false;
}

export function canAssignTask(role, assigneeId, userId) {
  // HR cannot assign tasks
  if (isHR(role)) return false;

  // Higher roles can assign to anyone
  if (isHighRole(role)) return true;

  // Senior Intern: can assign tasks to interns only
  if (role === "SENIOR_INTERN") {
    // Need to check if assigneeId is an intern
    // This will be checked in the controller by querying the user's role
    return true; // Permission check, actual role validation in controller
  }

  return false;
}

export function canUpdateTask(role, task, userId) {
  // HR cannot update tasks (view-only)
  if (isHR(role)) return false;

  // Higher roles can update any task
  if (isHighRole(role)) return true;

  // Senior intern: can update tasks related to them (assignee)
  if (role === "SENIOR_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Intern: only update status of tasks assigned to them
  if (role === "INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  return false;
}

export function canUpdateTaskStatus(role, task, userId) {
  // HR cannot update tasks (view-only)
  if (isHR(role)) return false;

  // Higher roles can update any task
  if (isHighRole(role)) return true;

  // Senior intern: can update status of tasks assigned to them
  if (role === "SENIOR_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Intern: can only update status of tasks assigned to them
  if (role === "INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  return false;
}

export function canUpdateTaskDetails(role, task, userId) {
  // HR cannot update tasks (view-only)
  if (isHR(role)) return false;

  // Higher roles can update any task details
  if (isHighRole(role)) return true;

  // Senior intern: can update details of tasks assigned to them
  if (role === "SENIOR_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Intern: cannot update task details (only status)
  return false;
}

export function canViewTask(role, task, userId) {
  // Higher roles: see all
  if (isHighRole(role)) return true;

  // HR: can view all tasks (for monitoring intern activity)
  if (isHR(role)) return true;

  // Senior intern: see tasks assigned to them
  if (role === "SENIOR_INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Intern: only see tasks assigned to them
  if (role === "INTERN") {
    return task && String(task.assignee_id) === String(userId);
  }

  // Default deny
  return false;
}

export function canDeleteTask(role, task, userId) {
  // HR cannot delete tasks (view-only)
  if (isHR(role)) return false;

  // Higher roles can delete any task
  if (isHighRole(role)) return true;

  // Senior intern: can delete tasks they created or are assigned to
  if (role === "SENIOR_INTERN") {
    return task && (
      String(task.created_by) === String(userId) ||
      String(task.assignee_id) === String(userId)
    );
  }

  // Intern: cannot delete tasks
  return false;
}

// ========== DOCS PERMISSIONS ==========

export function canCreateDoc(role) {
  // Higher roles can create docs
  if (isHighRole(role)) return true;
  
  // HR can create docs
  if (isHR(role)) return true;
  
  // Senior Interns can create docs
  if (role === "SENIOR_INTERN") return true;
  
  // Interns cannot create docs
  return false;
}

export function canUpdateDoc(role, doc, userId) {
  // Higher roles can update any doc
  if (isHighRole(role)) return true;
  
  // HR can update any doc
  if (isHR(role)) return true;
  
  // Senior Interns can update docs they created
  if (role === "SENIOR_INTERN") {
    return doc && String(doc.created_by) === String(userId);
  }
  
  // Interns cannot update docs
  return false;
}

export function canDeleteDoc(role, doc, userId) {
  // Higher roles can delete any doc
  if (isHighRole(role)) return true;
  
  // HR can delete any doc
  if (isHR(role)) return true;
  
  // Senior Interns can delete docs they created
  if (role === "SENIOR_INTERN") {
    return doc && String(doc.created_by) === String(userId);
  }
  
  // Interns cannot delete docs
  return false;
}

// ========== FILES PERMISSIONS ==========

export function canDeleteFile(role, file, userId) {
  // Higher roles can delete any file
  if (isHighRole(role)) return true;
  
  // HR can delete any file
  if (isHR(role)) return true;
  
  // Senior Interns can delete files they uploaded
  if (role === "SENIOR_INTERN") {
    // Check both user_id and uploaded_by fields (depending on schema)
    return file && (
      String(file.user_id) === String(userId) || 
      String(file.uploaded_by) === String(userId)
    );
  }
  
  // Interns cannot delete files
  return false;
}