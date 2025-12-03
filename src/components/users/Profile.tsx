import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Building2,
  Edit3,
  GraduationCap,
  Mail,
  TrendingUp,
  Trophy,
  User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/static-data/routes";
import { userKeys } from "@/tanstack/keys/userKeys";
import { getUserById, getUserProgress } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";
import { getCourseProgressStats } from "./helper";

const Profile = () => {
  const { user: rawUser } = useAuth();
  const navigate = useNavigate();

  const {
    data: { user },
  } = useSuspenseQuery({
    queryKey: userKeys.getById(rawUser?.id || ""),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: rawUser?.id || "" });
    },
  });

  const { data: courseProgressData } = useSuspenseQuery({
    queryKey: userKeys.getProgress(user?.id || ""),
    queryFn: async () => {
      return getUserProgress(axiosInstance, { id: user?.id || "" });
    },
    select: (data) => data.progress,
  });

  const { avgCompletionRate } = useMemo(
    () => getCourseProgressStats(courseProgressData || []),
    [courseProgressData],
  );

  const handleEditClick = (userId: string) => {
    navigate(routes.USER_EDIT(userId));
  };

  const identityFields = [
    { label: "First name", value: user.firstName },
    { label: "Last name", value: user.lastName },
    { label: "Graduation year", value: user.year || "N/A" },
  ];

  const contactFields = [
    {
      label: "Email address",
      value: user.email,
      helper: "Email cannot be changed",
      icon: Mail,
    },
    {
      label: "Student ID",
      value: `#${user.uniqueId || "N/A"}`,
      mono: true,
    },
  ];

  const summaryTiles = [
    {
      label: "Role",
      value: user.role,
      icon: GraduationCap,
    },
    {
      label: "Organization",
      value: user.organization?.name || "Not assigned",
      icon: Building2,
    },
    {
      label: "Branch",
      value: user.branch || "Not specified",
      icon: BookOpen,
    },
    {
      label: "Day streak",
      value: user.streakCount ?? 0,
      icon: Trophy,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Account overview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">
            Keep your profile up to date and monitor your progress.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-center sm:w-auto"
          onClick={() => handleEditClick(user?.id || "")}
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Edit profile
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryTiles.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardDescription>{label}</CardDescription>
              <span className="rounded-full bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="h-fit">
          <CardHeader className="flex-row items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-semibold">
                Personal information
              </CardTitle>
              <CardDescription>
                Basics that appear across the platform.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {identityFields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {field.label}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {field.value}
                </p>
              </div>
            ))}
            {contactFields.map(({ label, value, helper, icon: Icon, mono }) => (
              <div key={label} className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
                  <span
                    className={mono ? "rounded-lg bg-muted/50 px-2 py-1 font-mono" : ""}
                  >
                    {value}
                  </span>
                </div>
                {helper ? (
                  <p className="text-xs text-muted-foreground">{helper}</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg font-semibold">
                Academic progress
              </CardTitle>
              <CardDescription>At-a-glance performance metrics.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Average completion rate</span>
                <span className="font-medium text-primary">
                  {avgCompletionRate}%
                </span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${avgCompletionRate}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Track this metric to understand how consistently you finish the
              learning paths assigned to you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
