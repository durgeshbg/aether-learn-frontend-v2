import z from "zod";
import type { CodeSolution } from "./CodeSolution";
import type { Organization } from "./Organization";
import type { QuizResult } from "./QuizResult";

export type Role = "ADMIN" | "USER";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organization?: Organization;
  orgAdminOf?: Organization;
  codeSolutions?: CodeSolution[];
  quizResults?: QuizResult[];
  createdAt: string;
  updatedAt: string;
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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
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
