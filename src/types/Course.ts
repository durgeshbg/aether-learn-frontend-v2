import type { CodeAssesment } from "./CodeAssesment";
import type { DifficultyLevelType, Lesson } from "./Lesson";
import type { Quiz } from "./Quiz";
import { z } from "zod";

export type Course = {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  rating: number;
  difficulty: DifficultyLevelType;
  lessonsCount: number;
  quizzesCount: number;
  modulesCount: number;
  codeAssessmentsCount: number;
  lessons?: Lesson[];
  quizzes?: Quiz[];
  codeAssessments?: CodeAssesment[];

  feedbackSubmitted?: boolean;
  enrolled: boolean;

  createdAt: string;
  updatedAt: string;
};

export type CourseFeedback = {
  id: string;
  rating: number;
  comment?: string;
  user?: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
  };
  courseId: string;
  createdAt: string;
  updatedAt: string;
};

export type CourseFeebacks = {
  feedbacks: CourseFeedback[];
};

export const CourseCreateSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

export const CourseUpdateSchema = CourseCreateSchema.extend({
  name: z.string().min(1, "Course name too short").optional(),
});

export const CourseIdParamSchema = z.object({
  id: z.string().cuid("Invalid course ID format"),
});

export const CourseOrganizationIDQuerySchema = z.object({
  organizationId: z.string().cuid("Invalid organization ID format").optional(),
});

export const CourseOrganizationIDQueryRequiredSchema = z.object({
  organizationId: z.string().cuid("Invalid organization ID format"),
});

export const CourseFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type CourseCreateType = z.infer<typeof CourseCreateSchema>;
export type CourseUpdateType = z.infer<typeof CourseUpdateSchema>;
export type CourseIdParamType = z.infer<typeof CourseIdParamSchema>;
export type CourseOrganizationIDQueryType = z.infer<
  typeof CourseOrganizationIDQuerySchema
>;
export type CourseOrganizationIDQueryRequiredType = z.infer<
  typeof CourseOrganizationIDQueryRequiredSchema
>;
export type CourseFeedbackType = z.infer<typeof CourseFeedbackSchema>;
