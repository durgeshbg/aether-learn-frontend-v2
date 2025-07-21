import { codeAssessmentKeys } from './code-assesment';

export const testCaseKeys = {
  all: (courseId: string, codeAssessmentId: string) => [
    ...codeAssessmentKeys.getById(courseId, codeAssessmentId),
    'testCases',
  ],
  create: (courseId: string, codeAssessmentId: string) => [
    ...testCaseKeys.all(courseId, codeAssessmentId),
    'create',
  ],
  getById: (courseId: string, codeAssessmentId: string, id: string) => [
    ...testCaseKeys.all(courseId, codeAssessmentId),
    id,
  ],
  update: (courseId: string, codeAssessmentId: string, id: string) => [
    ...testCaseKeys.getById(courseId, codeAssessmentId, id),
    'update',
  ],
  delete: (courseId: string, codeAssessmentId: string, id: string) => [
    ...testCaseKeys.getById(courseId, codeAssessmentId, id),
    'delete',
  ],
};
