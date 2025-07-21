import { courseKeys } from './courseKeys';

export const quizKeys = {
  all: (courseId: string) => [...courseKeys.getById(courseId), 'quizzes'],
  create: (courseId: string) => [...quizKeys.all(courseId), 'create'],
  getById: (courseId: string, id: string) => [...quizKeys.all(courseId), id],
  update: (courseId: string, id: string) => [
    ...quizKeys.getById(courseId, id),
    'update',
  ],
  delete: (courseId: string, id: string) => [
    ...quizKeys.getById(courseId, id),
    'delete',
  ],
};
