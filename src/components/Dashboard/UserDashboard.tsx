import {
  Activity,
  Award,
  BookOpen,
  Code,
  FileText,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { userKeys } from "@/tanstack/keys/userKeys";
import { getCourses } from "@/services/course";
import { getUserProgress } from "@/services/user";
import type { CourseProgress, ModuleLink } from "@/types/User";
import { axiosInstance } from "@/utils/axiosInstance";
import { getModuleLink } from "@/utils/getModuleLink";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { completionStats, courseCompletiondata } from "./helpers";

const userStats = {
  averageScore: 87,
};

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: progressData } = useQuery({
    queryKey: userKeys.getProgress(user?.id || ""),
    queryFn: async () => {
      return getUserProgress(axiosInstance, { id: user?.id || "" });
    },
    select: (data) => data.progress,
  });

  const { data: courses } = useQuery({
    queryKey: courseKeys.all(),
    queryFn: async () => {
      return getCourses(axiosInstance, {
        organizationId: user?.organization?.id || "",
      });
    },
    select: (data) => data.courses,
  });

  const {
    completedModules,
    totalModules,
    completedQuizzes,
    totalQuizzes,
    totalCodeAssessments,
    completedCodeAssessments,
  } = completionStats(courses || [], progressData || []);

  const {
    completedCoursesCount,
    totalEnrolledCoursesCount,
    sumCompletionRate,
  } = courseCompletiondata(progressData || []);

  const overallProgress = totalEnrolledCoursesCount
    ? Math.round(sumCompletionRate / totalEnrolledCoursesCount)
    : 0;

  const breakdown = [
    {
      label: "Modules",
      completed: completedModules,
      total: totalModules,
      icon: BookOpen,
    },
    {
      label: "Quizzes",
      completed: completedQuizzes,
      total: totalQuizzes,
      icon: FileText,
    },
    {
      label: "Code assessments",
      completed: completedCodeAssessments,
      total: totalCodeAssessments,
      icon: Code,
    },
  ];

  const highlightCards = [
    {
      label: "Average score",
      value: `${userStats.averageScore}%`,
      icon: Award,
      helper: "+3% vs last month",
    },
    {
      label: "Courses completed",
      value: completedCoursesCount,
      icon: Target,
      helper: `of ${totalEnrolledCoursesCount} enrolled`,
    },
    {
      label: "Active streak",
      value: `${user?.streakCount || 0} days`,
      icon: Activity,
      helper: `Last active ${lastTimeAgo(user?.lastActiveAt || "")}`,
    },
  ];

  const handleContinueLearning = (moduleLink: ModuleLink | null) => {
    navigate(getModuleLink(moduleLink));
  };

  const handleSubmissionClick = (progress: CourseProgress) => {
    navigate(routes.COURSE_SUBMISSIONS(progress.course.id));
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Hi {user?.firstName}, welcome back
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your learning dashboard
            </h1>
            <p className="text-muted-foreground">
              Track progress, celebrate wins, and jump back into a module.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="gap-4 border-b pb-6">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary/10 p-2 text-primary">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-base font-medium text-muted-foreground">
                  Overall progress
                </CardTitle>
                <p className="text-3xl font-semibold text-foreground">
                  {overallProgress}%
                </p>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 pt-6">
            {breakdown.map(({ label, completed, total, icon: Icon }) => (
              <div
                key={label}
                className="flex min-w-[140px] flex-1 items-center justify-between rounded-lg border px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {completed}/{total}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:col-span-2">
          {highlightCards.map(({ label, value, icon: Icon, helper }) => (
            <Card key={label} className="h-full">
              <CardHeader className="flex-row items-start justify-between pb-2">
                <div>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-2xl font-semibold">
                    {value}
                  </CardTitle>
                </div>
                <span className="rounded-full bg-muted p-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{helper}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Course progress
            </h2>
            <p className="text-sm text-muted-foreground">
              Continue where you left off or review submissions.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {progressData && progressData.length > 0 ? (
            progressData.map((progress) => (
              <Card key={progress.id} className="border border-border">
                <CardHeader className="flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {progress.course.name}
                    </CardTitle>
                    <CardDescription>
                      Last accessed {lastTimeAgo(progress.updatedAt)}
                    </CardDescription>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {progress.completionRate}%
                  </span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress.completionRate}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                    <span>
                      Next up:{" "}
                      <span className="font-medium text-foreground">
                        {progress.nextModule?.title || "Module to be assigned"}
                      </span>
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubmissionClick(progress)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Submissions
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleContinueLearning(progress.nextModule)
                        }
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  You don’t have active courses yet. Explore the catalog to get
                  started.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;
