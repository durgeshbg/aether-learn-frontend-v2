export type CodeSolutionStatus = "SUBMITTED" | "GRADED";
import { z } from "zod";

export type CodeSolution = {
  id: string;
  code: string;
  status: CodeSolutionStatus;
  userId: string;
  assessmentId: string;
  createdAt: string;
  updatedAt: string;
};

export const CodeSolutionStatus = {
  SUBMITTED: "SUBMITTED",
  GRADED: "GRADED",
};

export const CodeSolutionCreateSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export const CodeSolutionStatusUpdateSchema = z.object({
  status: z.enum([CodeSolutionStatus.GRADED, CodeSolutionStatus.SUBMITTED], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

export const CodeSolutionScoreUpdateSchema = z.object({
  score: z
    .number()
    .min(0, "Score must be a non-negative number")
    .max(100, "Score must be at most 100"),
});

export const CodeSolutionAssesmentCourseIdParamSchema = z.object({
  courseId: z.string().cuid("Invalid course ID format"),
  codeAssessmentId: z.string().cuid("Invalid code assessment ID format"),
});

export const CodeSolutionIdParamSchema = z.object({
  courseId: z.string().cuid("Invalid course ID format"),
  codeAssessmentId: z.string().cuid("Invalid code solution ID format"),
  id: z.string().cuid("Invalid code assessment ID format"),
});

export type CodeSolutionCreateType = z.infer<typeof CodeSolutionCreateSchema>;
export type CodeSolutionStatusUpdateType = z.infer<
  typeof CodeSolutionStatusUpdateSchema
>;
export type CodeSolutionScoreUpdateType = z.infer<
  typeof CodeSolutionScoreUpdateSchema
>;
export type CodeSolutionAssesmentCourseIdParamsType = z.infer<
  typeof CodeSolutionAssesmentCourseIdParamSchema
>;
export type CodeSolutionIdParamsType = z.infer<
  typeof CodeSolutionIdParamSchema
>;
