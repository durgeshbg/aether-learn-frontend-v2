export const userKeys = {
  all: () => ['users'] as const,
  login: () => [...userKeys.all(), 'login'] as const,
  me: () => [...userKeys.all(), 'me'] as const,
  create: () => [...userKeys.all(), 'create'] as const,
  getAllInOrg: () => [...userKeys.all(), 'organization'] as const,
  getInOrg: (userId: string) => [...userKeys.getAllInOrg(), userId] as const,
  getById: (userId: string) => [...userKeys.all(), userId] as const,
  updateName: (userId: string) =>
    [...userKeys.getById(userId), 'name'] as const,
  updateOrganization: (userId: string) =>
    [...userKeys.getById(userId), 'organization'] as const,
  updateOrganizationAdmin: (userId: string) =>
    [...userKeys.getById(userId), 'organization-admin'] as const,
  updateRole: (userId: string) =>
    [...userKeys.getById(userId), 'role'] as const,
  delete: (userId: string) => [...userKeys.getById(userId), 'delete'] as const,
};
