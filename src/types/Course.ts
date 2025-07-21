import type { CodeAssesment } from './CodeAssesment';
import type { Lesson } from './Lesson';
import type { Quiz } from './Quiz';
import { z } from 'zod';

export type Course = {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;

  lessons?: Lesson[];
  quizzes?: Quiz[];
  codeAssessments?: CodeAssesment[];
  createdAt: string;
  updatedAt: string;
};

export const CourseCreateSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

export const CourseUpdateSchema = CourseCreateSchema.extend({
  name: z.string().min(1, 'Course name too short').optional(),
});

export const CourseIdParamSchema = z.object({
  id: z.string().cuid('Invalid course ID format'),
});

export type CourseCreateType = z.infer<typeof CourseCreateSchema>;
export type CourseUpdateType = z.infer<typeof CourseUpdateSchema>;
export type CourseIdParamType = z.infer<typeof CourseIdParamSchema>;
