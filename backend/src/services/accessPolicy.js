const accessPolicy = {

  SUPER_ADMIN: [ 
    "OVERVIEW",

    "TASKS",
    // "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
  ],

  ADMIN: [
     "OVERVIEW",
    "TASKS",
    // "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
  ],

  HR: [
   "OVERVIEW",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
  ],

  TEAM_LEAD: [
     "OVERVIEW",
    // "MY_WORK",
    "TASKS",
    // "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
   
  ],

  SENIOR_INTERN: [
    "OVERVIEW",
    // "MY_WORK",
    "TASKS",
    
    // "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
  ],

  INTERN: [
    "OVERVIEW",
    // "MY_WORK",
    "TASKS",
    // "PROJECTS",
    "DOCS",
    "FILES",
    "ANNOUNCEMENTS",
  ],
};

export function getAllowedModules(role) {
  return accessPolicy[role] || [];
}
