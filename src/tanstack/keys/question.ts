import { quizKeys } from './quizKeys';

export const questionKeys = {
  all: (courseId: string, quizId: string) =>
    [...quizKeys.getById(courseId, quizId), 'questions'] as const,
  create: (courseId: string, quizId: string) =>
    [...questionKeys.all(courseId, quizId), 'create'] as const,
  getById: (courseId: string, quizId: string, id: string) =>
    [...questionKeys.all(courseId, quizId), id] as const,
  update: (courseId: string, quizId: string, id: string) =>
    [...questionKeys.getById(courseId, quizId, id), 'update'] as const,
  delete: (courseId: string, quizId: string, id: string) =>
    [...questionKeys.getById(courseId, quizId, id), 'delete'] as const,
};
