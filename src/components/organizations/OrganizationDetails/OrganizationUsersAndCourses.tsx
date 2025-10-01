import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  UserPlus,
  UserMinus,
  Plus,
  Minus,
} from "lucide-react";
import { getNonOrganizationUsers, getUsers } from "@/services/user";
import { getCourses, getNonOrganizationCourses } from "@/services/course";
import { userKeys } from "@/tanstack/keys/userKeys";
import { courseKeys } from "@/tanstack/keys/courseKeys";

import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { routes } from "@/static-data/routes";

const OrganizationUsersAndCourses = () => {
  const { organizationId = "" } = useParams<{
    organizationId: string;
  }>();
  const navigate = useNavigate();

  const { data: users } = useSuspenseQuery({
    queryKey: userKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getUsers(axiosInstance, { organizationId });
    },
    select: (data) => data.users,
  });

  const { data: nonOrgUsers } = useSuspenseQuery({
    queryKey: userKeys.allNonOrganization(),
    queryFn: async () => {
      return getNonOrganizationUsers(axiosInstance);
    },
    select: (data) => data.users,
  });

  const { data: courses } = useSuspenseQuery({
    queryKey: courseKeys.getByOrganization(organizationId),
    queryFn: async () => {
      return getCourses(axiosInstance, { organizationId });
    },
    select: (data) => data.courses,
  });

  const { data: nonOrgCourses } = useSuspenseQuery({
    queryKey: courseKeys.allNonOrganization(organizationId),
    queryFn: async () => {
      return getNonOrganizationCourses(axiosInstance, { organizationId });
    },
    select: (data) => data.courses,
  });

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Students Section */}
      <div className="space-y-6">
        {/* Enrolled Students */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Enrolled Students ({users?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20"
              onClick={() =>
                navigate(routes.ORGANIZATION_EDIT_USERS_REMOVE(organizationId))
              }
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Remove Students
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/10"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground text-sm">
                No students enrolled
              </p>
            )}
          </div>
        </div>

        {/* Available Students */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Available Students ({nonOrgUsers?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-500/10 border-green-500/20 text-green-700 hover:bg-green-500/20"
              onClick={() =>
                navigate(routes.ORGANIZATION_EDIT_USERS_ADD(organizationId))
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Students
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {nonOrgUsers?.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/10"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground text-sm">
                No available students
              </p>
            )}
            {nonOrgUsers && nonOrgUsers.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{nonOrgUsers.length - 5} more students available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="space-y-6">
        {/* Active Courses */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Active Courses ({courses?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20"
              onClick={() =>
                navigate(
                  routes.ORGANIZATION_EDIT_COURSES_REMOVE(organizationId),
                )
              }
            >
              <Minus className="h-4 w-4 mr-2" />
              Remove Courses
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {courses?.map((course) => (
              <div
                key={course.id}
                className="p-3 rounded-lg bg-muted/10 border border-border/10"
              >
                <p className="font-medium text-sm">{course.name}</p>
                <p className="text-xs text-muted-foreground">
                  {course.description}
                </p>
              </div>
            )) || (
              <p className="text-muted-foreground text-sm">No active courses</p>
            )}
          </div>
        </div>

        {/* Available Courses */}
        <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Available Courses ({nonOrgCourses?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-green-500/10 border-green-500/20 text-green-700 hover:bg-green-500/20"
              onClick={() =>
                navigate(routes.ORGANIZATION_EDIT_COURSES_ADD(organizationId))
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Courses
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {nonOrgCourses?.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="p-3 rounded-lg bg-muted/10 border border-border/10"
              >
                <p className="font-medium text-sm">{course.name}</p>
                <p className="text-xs text-muted-foreground">
                  {course.description}
                </p>
              </div>
            )) || (
              <p className="text-muted-foreground text-sm">
                No available courses
              </p>
            )}
            {nonOrgCourses && nonOrgCourses.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{nonOrgCourses.length - 5} more courses available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationUsersAndCourses;
