import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Building, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/static-data/routes";
import { getDashboardStats } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";
import { userKeys } from "@/tanstack/keys/userKeys";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleManageUsers = () => navigate(routes.USERS);
  const handleManageOrganizations = () => navigate(routes.ORGANIZATIONS);
  const handleManageCourses = () => navigate(routes.COURSES);

  const { data: dashboardData } = useQuery({
    queryKey: userKeys.dashBoardStats(),
    queryFn: async () => {
      return getDashboardStats(axiosInstance);
    },
    select: (data) => data.dashboardData,
  });

  const overview = [
    {
      label: "Organizations",
      value: dashboardData?.organizationsCount ?? 0,
      icon: Building,
      helper: "Active tenant accounts",
      badge: "Network",
    },
    {
      label: "Total users",
      value: dashboardData?.usersCount ?? 0,
      icon: Users,
      helper: "Learners + admins",
      badge: "Members",
    },
    {
      label: "Total courses",
      value: dashboardData?.coursesCount ?? 0,
      icon: BookOpen,
      helper: "In global library",
      badge: "Content",
    },
  ];

  const managementSections = [
    {
      title: "Organization management",
      icon: Building,
      helper:
        "Create, edit, or deactivate organizations and manage their admins.",
      bullets: [
        "Audit organizations and assigned owners",
        "Create or update organization settings",
        "Assign or revoke organization admin roles",
      ],
      action: {
        label: "Manage organizations",
        handler: handleManageOrganizations,
      },
    },
    {
      title: "Course management",
      icon: BookOpen,
      helper: "Maintain the global catalog and assign content at scale.",
      bullets: [
        "Create and update course templates",
        "Attach courses to organizations",
        "Monitor library growth and usage",
      ],
      action: {
        label: "Manage courses",
        handler: handleManageCourses,
      },
    },
    {
      title: "User management",
      icon: Users,
      helper:
        "Invite, deactivate, or adjust roles for members across the platform.",
      bullets: [
        "Search users across all organizations",
        "Invite new admins or learners",
        "Escalate support via impersonation",
      ],
      action: {
        label: "Manage users",
        handler: handleManageUsers,
      },
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Super admin view
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Control center
      </h1>
            <p className="text-muted-foreground">
              Monitor the platform and jump straight into the workflows that
              need your attention.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {overview.map(({ label, value, icon: Icon, helper, badge }) => (
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

      <section className="grid gap-4 lg:grid-cols-3">
        {managementSections.map(
          ({ title, icon: Icon, helper, bullets, action }) => (
            <Card key={title} className="flex flex-col">
              <CardHeader className="gap-3 pb-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <CardTitle className="text-base font-semibold">
                      {title}
                    </CardTitle>
                    <CardDescription>{helper}</CardDescription>
          </div>
        </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 size-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
        </ul>
                <div className="pt-2">
          <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={action.handler}
          >
                    {action.label}
          </Button>
        </div>
              </CardContent>
            </Card>
          ),
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
