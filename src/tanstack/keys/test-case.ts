import { codeAssessmentKeys } from "./code-assesment";

export const testCaseKeys = {
  all: (courseId: string, codeAssessmentId: string) =>
    [
      ...codeAssessmentKeys.getById(courseId, codeAssessmentId),
      "testCases",
    ] as const,
  create: (courseId: string, codeAssessmentId: string) =>
    [...testCaseKeys.all(courseId, codeAssessmentId), "create"] as const,
  getById: (courseId: string, codeAssessmentId: string, id: string) =>
    [...testCaseKeys.all(courseId, codeAssessmentId), id] as const,
  update: (courseId: string, codeAssessmentId: string, id: string) =>
    [
      ...testCaseKeys.getById(courseId, codeAssessmentId, id),
      "update",
    ] as const,
  delete: (courseId: string, codeAssessmentId: string, id: string) =>
    [
      ...testCaseKeys.getById(courseId, codeAssessmentId, id),
      "delete",
    ] as const,
};
