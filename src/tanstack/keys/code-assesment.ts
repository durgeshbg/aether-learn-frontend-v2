import { courseKeys } from './courseKeys';

export const codeAssessmentKeys = {
  all: (courseId: string) => [
    ...courseKeys.getById(courseId),
    'codeAssessments',
  ],
  create: (courseId: string) => [...codeAssessmentKeys.all(courseId), 'create'],
  getById: (courseId: string, id: string) => [
    ...codeAssessmentKeys.all(courseId),
    id,
  ],
  update: (courseId: string, id: string) => [
    ...codeAssessmentKeys.getById(courseId, id),
    'update',
  ],
  delete: (courseId: string, id: string) => [
    ...codeAssessmentKeys.getById(courseId, id),
    'delete',
  ],
};
