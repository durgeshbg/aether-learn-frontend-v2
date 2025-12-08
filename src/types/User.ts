import z from "zod";
import type { CodeSolution } from "./CodeSolution";
import type { Organization } from "./Organization";
import type { QuizResult } from "./QuizResult";

export type Role = "ADMIN" | "USER";

export type User = {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  orgAdminOf: {
    id: string;
    name: string;
  } | null;
  organization: {
    id: string;
    name: string;
  } | null;
  year?: number | null;
  branch?: string | null;
  uniqueId?: string | null;
};

export type UserWithDetails = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organization: Organization | null;
  orgAdminOf: {
    id: string;
    name: string;
  } | null;
  lastActiveAt: string;
  streakCount: number;
  codeSolutions?: CodeSolution[];
  quizResults?: QuizResult[];
  year?: number | null;
  branch?: string | null;
  uniqueId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserDashboardStats = {
  dashboardData: {
    organizationsCount?: number;
    usersCount: number;
    coursesCount: number;
    enrolledCoursesCount?: number;
    top5CompletedCourses?: {
      id: string;
      name: string;
      totalEnrollments: number;
      averageCompletionRate: number;
    }[];
    recentlyUpdatedCourses?: {
      id: string;
      course: {
        id: string;
        name: string;
      };
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
      completionRate: number;
      updatedAt: string;
    }[];
  };
};

export type IDObject = {
  id: string;
  title: string;
};

export type CourseProgress = {
  id: string;
  userId: string;
  course: {
    id: string;
    name: string;
  };
  completionRate: number;
  completedModules: IDObject[];
  completedQuizzes: IDObject[];
  completedAssessments: IDObject[];
  nextModuleId?: string;
  nextModule: ModuleLink | null;
  createdAt: string;
  updatedAt: string;
};

export type UserProgress = {
  progress: CourseProgress[];
};

export type ModuleLink = {
  id: string;
  title: string;
  lesson: {
    id: string;
    title: string;
    course: {
      id: string;
      name: string;
    };
  };
};

export type Bookmark = {
  id: string;
  module: ModuleLink;
  createdAt: string;
};

export type UserBookmarks = {
  bookmarks: Bookmark[];
};

export const UserLoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

export const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  organizationId: z.string().cuid("Invalid organization ID format").optional(),
  branch: z.string().optional(),
  uniqueId: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  orgAdmin: z.boolean().default(false).optional(),
  role: z
    .enum(["ADMIN", "USER"], {
      errorMap: () => ({
        message: "Role must be either ADMIN or USER",
      }),
    })
    .default("USER")
    .optional(),
});

export const UserDetailsUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email().optional(),
  branch: z.string().optional(),
  uniqueId: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
});

export const UserCourseEnrollmentUpdateSchema = z.object({
  courseId: z.string().cuid("Invalid course ID format"),
  enroll: z.boolean().default(true),
});

export const UserBookMarkModuleUpdateSchema = z.object({
  moduleId: z.string().cuid("Invalid module ID format"),
  bookmark: z.boolean().default(true),
});

export const UserMarkAsCompleteUpdateSchema = z.object({
  courseId: z.string().cuid("Invalid course ID"),
  moduleId: z.string().cuid("Invalid module ID").optional(),
  complete: z.boolean(),
});

export const UserOrganizationUpdateSchema = z.object({
  organizationId: z.string().cuid("Invalid organization ID format"),
});

export const UserRoleUpdateSchema = z.object({
  role: z.enum(["ADMIN", "USER"], {
    errorMap: () => ({
      message: "Role must be either ADMIN or USER",
    }),
  }),
});

export const UserIdParamSchema = z.object({
  id: z.string().cuid("Invalid user ID format"),
});

export const UserFilterQuerySchema = z.object({
  filter: z
    .enum(["code-solutions", "quiz-results"], {
      errorMap: () => ({
        message: "Filter must be either code-solutions or quiz-results",
      }),
    })
    .optional(),
});

export const UserOrganizationIDQuerySchema = z.object({
  organizationId: z.string().cuid("Invalid organization ID format").optional(),
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;
export type UserDetailsUpdateType = z.infer<typeof UserDetailsUpdateSchema>;
export type UserOrganizationUpdateType = z.infer<
  typeof UserOrganizationUpdateSchema
>;
export type UserRoleUpdateType = z.infer<typeof UserRoleUpdateSchema>;
export type UserLoginType = z.infer<typeof UserLoginSchema>;
export type UserIdParamType = z.infer<typeof UserIdParamSchema>;
export type UserFilterQueryType = z.infer<typeof UserFilterQuerySchema>;
export type UserOrganizationIDQueryType = z.infer<
  typeof UserOrganizationIDQuerySchema
>;
export type UserCourseEnrollmentUpdateType = z.infer<
  typeof UserCourseEnrollmentUpdateSchema
>;
export type UserBookMarkModuleUpdateType = z.infer<
  typeof UserBookMarkModuleUpdateSchema
>;
export type UserMarkAsCompleteUpdateType = z.infer<
  typeof UserMarkAsCompleteUpdateSchema
>;
