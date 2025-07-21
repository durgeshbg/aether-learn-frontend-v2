import { codeAssessmentKeys } from './code-assesment';

export const codeSolutionKeys = {
  all: (courseId: string, codeAssessmentId: string) =>
    [
      ...codeAssessmentKeys.getById(courseId, codeAssessmentId),
      'code-solutions',
    ] as const,
  create: (courseId: string, codeAssessmentId: string) =>
    [codeSolutionKeys.all(courseId, codeAssessmentId), 'create'] as const,
  getById: (courseId: string, codeAssessmentId: string, id: string) =>
    [...codeSolutionKeys.all(courseId, codeAssessmentId), id] as const,
  // delete: (courseId: string, codeAssessmentId: string, id: string) =>
  //   [
  //     ...codeSolutionKeys.getById(courseId, codeAssessmentId, id),
  //     'delete',
  //   ] as const,
};
