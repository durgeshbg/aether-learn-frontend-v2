export type CodeSolutionStatus = "SUBMITTED" | "GRADED";
export type CodeSolutionType = "SUBMISSION" | "RUN";

import { z } from "zod";
import type { TestCaseResult } from "./TestCaseResult";

export type CodeSolution = {
  id: string;
  code: string;
  status: CodeSolutionStatus;
  type: CodeSolutionType;
  assessment: {
    select: {
      id: string;
      title: string;
    };
  };
  testCaseResults?: TestCaseResult[];
  createdAt: string;
  updatedAt: string;
};

export const CodeSolutionCreateSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export const CodeSolutionAssesmentIdParamSchema = z.object({
  courseId: z.string().cuid("Invalid course ID format"),
  codeAssessmentId: z.string().cuid("Invalid code assessment ID format"),
});

export const CodeSolutionIdParamSchema = z.object({
  courseId: z.string().cuid("Invalid course ID format"),
  codeAssessmentId: z.string().cuid("Invalid code solution ID format"),
  id: z.string().cuid("Invalid code assessment ID format"),
});

export type CodeSolutionCreateType = z.infer<typeof CodeSolutionCreateSchema>;
export type CodeSolutionAssesmentIdParamType = z.infer<
  typeof CodeSolutionAssesmentIdParamSchema
>;
export type CodeSolutionIdParamType = z.infer<typeof CodeSolutionIdParamSchema>;
