import { quizKeys } from './quizKeys';

export const quizResultKeys = {
  all: (courseId: string, quizId: string) =>
    [...quizKeys.getById(courseId, quizId), 'quiz-results'] as const,
  getById: (courseId: string, quizId: string, id: string) =>
    [...quizResultKeys.all(courseId, quizId), id] as const,
  create: (courseId: string, quizId: string) =>
    [...quizResultKeys.all(courseId, quizId), 'create'] as const,
  delete: (courseId: string, quizId: string, id: string) =>
    [...quizResultKeys.getById(courseId, quizId, id), 'delete'] as const,
};
