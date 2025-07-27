import { courseKeys } from './courseKeys';

export const codeAssessmentKeys = {
  all: (courseId: string) =>
    [...courseKeys.getById(courseId), 'codeAssessments'] as const,
  create: (courseId: string) =>
    [...codeAssessmentKeys.all(courseId), 'create'] as const,
  getById: (courseId: string, id: string) =>
    [...codeAssessmentKeys.all(courseId), id] as const,
  update: (courseId: string, id: string) =>
    [...codeAssessmentKeys.getById(courseId, id), 'update'] as const,
  delete: (courseId: string, id: string) =>
    [...codeAssessmentKeys.getById(courseId, id), 'delete'] as const,
};
