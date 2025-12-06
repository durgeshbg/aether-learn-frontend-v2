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
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Enrolled students ({users?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(routes.ORGANIZATION_EDIT_USERS_REMOVE(organizationId))
              }
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {users?.length
              ? users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-8 w-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              : (
                  <p className="text-sm text-muted-foreground">
                    No students enrolled.
                  </p>
                )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Available students ({nonOrgUsers?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(routes.ORGANIZATION_EDIT_USERS_ADD(organizationId))
              }
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {nonOrgUsers?.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
            {!nonOrgUsers?.length && (
              <p className="text-sm text-muted-foreground">
                No available students.
              </p>
            )}
            {nonOrgUsers && nonOrgUsers.length > 5 && (
              <p className="pt-2 text-center text-xs text-muted-foreground">
                +{nonOrgUsers.length - 5} more students available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Active courses ({courses?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(routes.ORGANIZATION_EDIT_COURSES_REMOVE(organizationId))
              }
            >
              <Minus className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {courses?.length
              ? courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-lg border border-border/60 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {course.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                ))
              : (
                  <p className="text-sm text-muted-foreground">
                    No active courses.
                  </p>
                )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Available courses ({nonOrgCourses?.length || 0})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(routes.ORGANIZATION_EDIT_COURSES_ADD(organizationId))
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {nonOrgCourses?.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="rounded-lg border border-border/60 px-3 py-2"
              >
                <p className="text-sm font-medium text-foreground">
                  {course.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {course.description}
                </p>
              </div>
            ))}
            {!nonOrgCourses?.length && (
              <p className="text-sm text-muted-foreground">
                No available courses.
              </p>
            )}
            {nonOrgCourses && nonOrgCourses.length > 5 && (
              <p className="pt-2 text-center text-xs text-muted-foreground">
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
