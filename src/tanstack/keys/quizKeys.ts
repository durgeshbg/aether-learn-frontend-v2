import { courseKeys } from "./courseKeys";

export const quizKeys = {
  all: (courseId: string) =>
    [...courseKeys.getById(courseId), "quizzes"] as const,
  create: (courseId: string) => [...quizKeys.all(courseId), "create"] as const,
  getById: (courseId: string, id: string) =>
    [...quizKeys.all(courseId), id] as const,
  update: (courseId: string, id: string) =>
    [...quizKeys.getById(courseId, id), "update"] as const,
  delete: (courseId: string, id: string) =>
    [...quizKeys.getById(courseId, id), "delete"] as const,
};
