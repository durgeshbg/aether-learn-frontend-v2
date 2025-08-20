import { lessonKeys } from "./lessonKeys";

export const moduleKeys = {
  all: (courseId: string, lessonId: string) =>
    [...lessonKeys.getById(courseId, lessonId), "modules"] as const,
  create: (courseId: string, lessonId: string) =>
    [...moduleKeys.all(courseId, lessonId), "create"] as const,
  getById: (courseId: string, lessonId: string, id: string) =>
    [...moduleKeys.all(courseId, lessonId), id] as const,
  update: (courseId: string, lessonId: string, id: string) =>
    [...moduleKeys.getById(courseId, lessonId, id), "update"] as const,
  delete: (courseId: string, lessonId: string, id: string) =>
    [...moduleKeys.getById(courseId, lessonId, id), "delete"] as const,
};
