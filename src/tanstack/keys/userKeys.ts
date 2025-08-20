export const userKeys = {
  all: () => ["users"] as const,
  getByOrganization: (organizationId: string) =>
    [...userKeys.all(), organizationId] as const,
  allNonOrganization: () =>
    [...userKeys.all(), "non-organization-users"] as const,
  login: () => [...userKeys.all(), "login"] as const,
  create: () => [...userKeys.all(), "create"] as const,
  getById: (userId: string) => [...userKeys.all(), userId] as const,
  updateDetails: (userId: string) =>
    [...userKeys.getById(userId), "details"] as const,
  updateOrganization: (userId: string) =>
    [...userKeys.getById(userId), "organization"] as const,
  updateRole: (userId: string) =>
    [...userKeys.getById(userId), "role"] as const,
  delete: (userId: string) => [...userKeys.getById(userId), "delete"] as const,
};
