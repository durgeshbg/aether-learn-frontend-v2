export const organizationKeys = {
  all: () => ['organizations'] as const,
  search: (name: string) =>
    [...organizationKeys.all(), 'search', name] as const,
  create: () => [...organizationKeys.all(), 'create'] as const,
  getById: (id: string) => [...organizationKeys.all(), id] as const,
  update: (id: string) => [...organizationKeys.getById(id), 'update'] as const,
  delete: (id: string) => [...organizationKeys.getById(id), 'delete'] as const,
  updateAdmin: (id: string) =>
    [...organizationKeys.getById(id), 'admin'] as const,
  // Users related keys
  getUsers: (id: string) => [...organizationKeys.getById(id), 'users'] as const,
  addUsers: (id: string) =>
    [...organizationKeys.getById(id), 'add', 'users'] as const,
  removeUsers: (id: string) =>
    [...organizationKeys.getById(id), 'remove', 'users'] as const,
  // Courses related keys
  getCourses: (id: string) =>
    [...organizationKeys.getById(id), 'courses'] as const,
  addCourses: (id: string) =>
    [...organizationKeys.getById(id), 'add', 'courses'] as const,
  removeCourses: (id: string) =>
    [...organizationKeys.getById(id), 'remove', 'courses'] as const,
};
