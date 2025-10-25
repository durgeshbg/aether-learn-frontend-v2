import { codeAssessmentKeys } from "./code-assesment";

export const codeSolutionKeys = {
  all: (courseId: string, codeAssessmentId: string) =>
    [
      ...codeAssessmentKeys.getById(courseId, codeAssessmentId),
      "code-solutions",
    ] as const,
  getById: (courseId: string, codeAssessmentId: string, id: string) =>
    [...codeSolutionKeys.all(courseId, codeAssessmentId), id] as const,
  run: (courseId: string, codeAssessmentId: string) =>
    [...codeSolutionKeys.all(courseId, codeAssessmentId), "run"] as const,
  submit: (courseId: string, codeAssessmentId: string) =>
    [...codeSolutionKeys.all(courseId, codeAssessmentId), "submit"] as const,
  getStatus: (courseId: string, codeAssessmentId: string, id: string) =>
    [
      ...codeSolutionKeys.getById(courseId, codeAssessmentId, id),
      "status",
    ] as const,
};
