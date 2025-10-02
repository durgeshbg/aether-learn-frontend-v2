import { DifficultyLevel, type DifficultyLevelType } from "./Lesson";
import type { Question } from "./Question";
import { z } from "zod";

export type Quiz = {
  id: string;
  title: string;

  description?: string;
  difficulty?: DifficultyLevelType;
  durationMinutes?: number;
  passPercentage?: number;
  questions?: Question[];
  maxAttempts?: number;

  createdAt: string;
  updatedAt: string;
};

export const QuizCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required").optional(),
  difficulty: z.enum(
    [
      DifficultyLevel.BEGINNER,
      DifficultyLevel.INTERMEDIATE,
      DifficultyLevel.ADVANCED,
    ],
    {
      required_error: "Difficulty level is required",
      invalid_type_error: "Invalid difficulty level",
    },
  ),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be a positive integer")
    .optional(),
  passPercentage: z.coerce
    .number()
    .int()
    .min(1, "Passing percentage must be at least 1")
    .max(100, "Passing percentage cannot exceed 100")
    .optional(),
  maxAttempts: z.coerce
    .number()
    .int()
    .positive("Max attempts must be a positive integer")
    .optional(),
});

export const QuizUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  difficulty: z
    .enum(
      [
        DifficultyLevel.BEGINNER,
        DifficultyLevel.INTERMEDIATE,
        DifficultyLevel.ADVANCED,
      ],
      {
        invalid_type_error: "Invalid difficulty level",
      },
    )
    .optional(),
  durationMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be a positive integer")
    .optional(),
  passPercentage: z.coerce
    .number()
    .int()
    .min(1, "Passing percentage must be at least 1")
    .max(100, "Passing percentage cannot exceed 100")
    .optional(),
  maxAttempts: z.coerce
    .number()
    .int()
    .positive("Max attempts must be a positive integer")
    .optional(),
});

export const QuizIdParamsSchema = z.object({
  courseId: z.string().cuid("Invalid course ID format"),
  id: z.string().cuid("Invalid quiz ID format"),
});

export const QuizCourseIdParamsSchema = z.object({
  courseId: z.string().cuid("Invalid course ID format"),
});

export type QuizCreateType = z.infer<typeof QuizCreateSchema>;
export type QuizUpdateType = z.infer<typeof QuizUpdateSchema>;
export type QuizIdParamsType = z.infer<typeof QuizIdParamsSchema>;
export type QuizCourseIdParamsType = z.infer<typeof QuizCourseIdParamsSchema>;
