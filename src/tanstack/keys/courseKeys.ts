export const courseKeys = {
  all: () => ["courses"] as const,
  allNonOrganization: (organizationId: string) =>
    [...courseKeys.all(), "non-organization-courses", organizationId] as const,
  feedbacks: (courseId: string) =>
    [...courseKeys.all(), courseId, "feedbacks"] as const,
  getByOrganization: (organizationId: string) =>
    [...courseKeys.all(), organizationId] as const,
  create: () => [...courseKeys.all(), "create"] as const,
  createFeedback: (courseId: string) =>
    [...courseKeys.all(), courseId, "create-feedback"] as const,
  getById: (id: string) => [...courseKeys.all(), id] as const,
  update: (id: string) => [...courseKeys.all(), "update", id] as const,
  delete: (id: string) => [...courseKeys.all(), "delete", id] as const,
};
