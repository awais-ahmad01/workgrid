const accessPolicy = {
  // ROLE_SUPER_ADMIN: ["ALL"],

  SUPER_ADMIN: [ "OVERVIEW",
    "MY_WORK",
    "TASKS",
    "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
  ],

  ADMIN: [
    "MY_WORK",
    "TASKS",
    "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
    "OVERVIEW",
  ],

  HR: [
    "MY_WORK",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
    "OVERVIEW",
  ],

  TEAM_LEAD: [
    "MY_WORK",
    "TASKS",
    "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
    "OVERVIEW",
  ],

  SENIOR_INTERN: [
    "MY_WORK",
    "TASKS",
    "PROJECTS",
    "DOCS",
    "FILES",
  ],

  INTERN: [
    "MY_WORK",
    "TASKS",
    "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
  ],
};

export function getAllowedModules(role) {
  return accessPolicy[role] || [];
}
