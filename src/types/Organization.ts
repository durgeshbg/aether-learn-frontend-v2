import { z } from "zod";
import type { Role } from "./User";

export type Organization = {
  id: string;
  name: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  orgAdmin?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  orgAdminId?: string;
  usersCount: number;
  coursesCount: number;
  createdAt: string;
  updatedAt: string;
};

// export type OrganizationUser = {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: Role;
//   createdAt: string;
//   updatedAt: string;
// };
//
// export type OrganizationCourse = {
//   id: string;
//   name: string;
//   description: string;
//   thumbnailUrl: string;
//   rating: number;
//   codeAssessmentsCount: number;
//   lessonsCount: number;
//   modulesCount: number;
//   quizzesCount: number;
//   createdAt: string;
//   updatedAt: string;
// };
//
// export type OrganizationUsers = {
//   users: OrganizationUser[];
// };
//
// export type OrganizationCourses = {
//   courses: OrganizationCourse[];
// };

export const OrganizationCreateSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  description: z.string().optional(),
  logoUrl: z.string().url("Invalid logo URL format").optional(),
  websiteUrl: z.string().url("Invalid website URL format").optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  orgAdminId: z
    .string()
    .cuid("Invalid organization admin ID format")
    .optional(),
});

export const OrganizationUpdateSchema = OrganizationCreateSchema.extend({
  name: z.string().min(1, "Organization name too short").optional(),
});

export const OrganizationUserUpdateSchema = z.object({
  userIds: z.array(z.string().cuid("Invalid user ID format")),
});

export const OrganizationCourseUpdateSchema = z.object({
  courseIds: z.array(z.string().cuid("Invalid course ID format")),
});

export const OrgAdminUpdateScehma = z.object({
  userId: z.string().cuid("Invalid user ID format"),
});

export const OrganizationIdParamSchema = z.object({
  id: z.string().cuid("Invalid organization ID format"),
});

export type OrganizationCreateType = z.infer<typeof OrganizationCreateSchema>;
export type OrganizationUpdateType = z.infer<typeof OrganizationUpdateSchema>;
export type OrganizationUserUpdateType = z.infer<
  typeof OrganizationUserUpdateSchema
>;
export type OrganizationCourseUpdateType = z.infer<
  typeof OrganizationCourseUpdateSchema
>;
export type OrgAdminUpdateType = z.infer<typeof OrgAdminUpdateScehma>;
export type OrganizationIdParamType = z.infer<typeof OrganizationIdParamSchema>;
