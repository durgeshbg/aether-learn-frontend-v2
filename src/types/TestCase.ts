import { z } from 'zod';

export type TestCase = {
  id: string;
  input: string;
  expected: string;
  description: string;
  assesmentId: string;
  createdAt: string;
  updatedAt: string;
};

export const TestCaseCreateSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  expected: z.string().min(1, 'Expected output is required'),
  description: z.string().optional(),
});

export const TestCaseUpdateSchema = z.object({
  input: z.string().min(1, 'Input is required').optional(),
  expected: z.string().min(1, 'Expected output is required').optional(),
  description: z.string().optional(),
});

export const TestCaseIdParamsSchema = z.object({
  courseId: z.string().cuid('Invalid course ID format'),
  codeAssessmentId: z.string().cuid('Invalid code assessment ID format'),
  id: z.string().cuid('Invalid test case ID format'),
});
export const TestCaseCourseCodeAssessmentIdParamsSchema = z.object({
  courseId: z.string().cuid('Invalid course ID format'),
  codeAssessmentId: z.string().cuid('Invalid code assessment ID format'),
});

export type TestCaseCreateType = z.infer<typeof TestCaseCreateSchema>;
export type TestCaseUpdateType = z.infer<typeof TestCaseUpdateSchema>;
export type TestCaseIdParamsType = z.infer<typeof TestCaseIdParamsSchema>;
export type TestCaseCourseCodeAssessmentIdParamsType = z.infer<
  typeof TestCaseCourseCodeAssessmentIdParamsSchema
>;
