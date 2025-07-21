export const moduleKeys = {
  all: (courseId: string, lessonId: string) =>
    [courseId, lessonId, 'modules'] as const,
  create: (courseId: string, lessonId: string) =>
    [courseId, lessonId, 'modules', 'create'] as const,
  getById: (courseId: string, lessonId: string, id: string) =>
    [courseId, lessonId, 'modules', id] as const,
  update: (courseId: string, lessonId: string, id: string) =>
    [courseId, lessonId, 'modules', id, 'update'] as const,
  delete: (courseId: string, lessonId: string, id: string) =>
    [courseId, lessonId, 'modules', id, 'delete'] as const,
};
