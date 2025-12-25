export function resolveRole(user) {
  const role = user?.role || "intern";
  console.log("Resolving role for user:", user?.email, "with role:", role);

  switch (role.toLowerCase()) {
    case "super_admin":
      return "ROLE_SUPER_ADMIN";
    case "admin":
      return "ROLE_ADMIN";
    case "hr":
      return "ROLE_HR";
    case "team_lead":
      return "ROLE_TEAM_LEAD";
    case "senior_intern":
      return "ROLE_SENIOR_INTERN";
    case "intern":
    default:
      return "ROLE_INTERN";
  }
}
