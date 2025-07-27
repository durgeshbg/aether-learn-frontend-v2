import { courseKeys } from './courseKeys';

export const lessonKeys = {
  all: (courseId: string) =>
    [...courseKeys.getById(courseId), 'lessons'] as const,
  create: (courseId: string) =>
    [...lessonKeys.all(courseId), 'create'] as const,
  getById: (courseId: string, id: string) =>
    [...lessonKeys.all(courseId), id] as const,
  update: (courseId: string, id: string) =>
    [...lessonKeys.all(courseId), 'update', id] as const,
  delete: (courseId: string, id: string) =>
    [...lessonKeys.all(courseId), 'delete', id] as const,
};
