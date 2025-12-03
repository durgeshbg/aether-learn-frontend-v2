import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { routes } from "@/static-data/routes";
import { userKeys } from "@/tanstack/keys/userKeys";
import { getDashboardStats } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";

function OrganizationAdminDashboard({
  organizationId,
}: {
  organizationId: string;
}) {
  const navigate = useNavigate();

  const { data: dashboardData } = useQuery({
    queryKey: userKeys.dashBoardStats(),
    queryFn: async () => {
      return getDashboardStats(axiosInstance);
    },
    select: (data) => data.dashboardData,
  });

  const totalAverageCompletionRate =
    dashboardData?.top5CompletedCourses?.reduce(
      (acc, course) => acc + course.averageCompletionRate,
      0,
    );
  const averageCompletionRate = totalAverageCompletionRate
    ? (
        totalAverageCompletionRate /
        (dashboardData?.top5CompletedCourses?.length || 1)
      ).toFixed(2)
    : "0";

  const handleManageUsers = () => {
    navigate(routes.USERS);
  };

  const handleManageOrganization = () => {
    navigate(routes.ORGANIZATION_DETAILS(organizationId));
  };

  // const handleManageCourses = () => {
  //   navigate(routes.COURSES);
  // };

  // const handleViewAnalytics = () => {};

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Organization admin view
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Organization overview
            </h1>
            <p className="text-muted-foreground">
              Monitor learner engagement and jump into the workflows you manage
              most.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Organization users",
            value: dashboardData?.usersCount ?? 0,
            icon: Users,
            badge: "Members",
            helper: "Learners and admins",
          },
          {
            label: "Assigned courses",
            value: dashboardData?.coursesCount ?? 0,
            icon: BookOpen,
            badge: "Content",
            helper: "Across all teams",
          },
          {
            label: "Completion rate",
            value: `${averageCompletionRate}%`,
            icon: Award,
            badge: "Progress",
            helper: "Avg of top courses",
          },
        ].map(({ label, value, icon: Icon, badge, helper }) => (
          <Card key={label} className="h-full border border-border/60">
            <CardHeader className="gap-4 pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground/80">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {badge}
                  </span>
                  {label}
                </CardDescription>
                <span className="rounded-full bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <CardTitle className="text-3xl font-semibold text-foreground">
                {value}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {[
          {
            title: "User management",
            description:
              "Invite or deactivate members, and manage business units.",
            icon: Users,
            actionLabel: "Manage users",
            onClick: handleManageUsers,
          },
          {
            title: "Organization settings",
            description:
              "Update brand assets, features, and course assignments.",
            icon: Award,
            actionLabel: "Open settings",
            onClick: handleManageOrganization,
          },
        ].map(({ title, description, icon: Icon, actionLabel, onClick }) => (
          <Card key={title} className="flex flex-col">
            <CardHeader className="gap-3 pb-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 p-2 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <CardTitle className="text-base font-semibold">
                    {title}
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <Button variant="outline" className="w-full" onClick={onClick}>
                {actionLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Top performing courses
              </CardTitle>
              <CardDescription>
                Highest completion rates across your learners.
              </CardDescription>
            </div>
            <span className="rounded-full bg-primary/10 p-2 text-primary">
              <TrendingUp className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.top5CompletedCourses?.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-foreground">{course.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {course.totalEnrollments} enrolled
                  </p>
                </div>
                <span className="text-sm font-medium text-primary">
                  {course.averageCompletionRate}% completion
                </span>
              </div>
            ))}
            {!dashboardData?.top5CompletedCourses?.length && (
              <p className="text-sm text-muted-foreground">
                There are no courses with completion data yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Recent learner activity
              </CardTitle>
              <CardDescription>
                Live view of progress updated in the last 24 hours.
              </CardDescription>
            </div>
            <span className="rounded-full bg-primary/10 p-2 text-primary">
              <Clock className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.recentlyUpdatedCourses?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {activity.user.firstName} {activity.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.course.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">
                    {activity.completionRate}% done
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lastTimeAgo(activity.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
            {!dashboardData?.recentlyUpdatedCourses?.length && (
              <p className="text-sm text-muted-foreground">
                No activity recorded yet. Encourage learners to continue.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrganizationAdminDashboard;
