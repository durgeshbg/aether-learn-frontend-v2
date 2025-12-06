import { deleteUser, getUserById, getUserProgress } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { routes } from "@/static-data/routes";
import {
  ArrowLeft,
  GraduationCap,
  Edit3,
  Trash2,
  Shield,
  Building2,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useMemo, useState } from "react";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { getCourseProgressStats } from "./helper";
import { useAuth } from "@/hooks/useAuth";

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user: currentUser } = useAuth();

  const {
    data: { user },
  } = useSuspenseQuery({
    queryKey: userKeys.getById(userId || ""),
    queryFn: async () => {
      return getUserById(axiosInstance, { id: userId || "" });
    },
  });

  const { data: courseProgressData } = useSuspenseQuery({
    queryKey: userKeys.getProgress(user?.id || ""),
    queryFn: async () => {
      return getUserProgress(axiosInstance, { id: user?.id || "" });
    },
    select: (data) => data.progress,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: userKeys.delete(userId || ""),
    mutationFn: async (id: string) => {
      return deleteUser(axiosInstance, { id });
    },
    meta: {
      notify: true,
      successMessage: "Student deleted successfully",
      errorMessage: "Failed to delete student",
      invalidatesQueries: userKeys.all(),
    },
    onSettled: () => {
      navigate(routes.USERS);
    },
  });

  const handleDeleteUser = () => {
    if (showDeleteConfirm) {
      mutate(userId || "");
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  const { avgCompletionRate, totalCompletedAssignments } = useMemo(
    () => getCourseProgressStats(courseProgressData || []),
    [courseProgressData]
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(routes.USERS)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Student</p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {user.firstName} {user.lastName}
            </h1>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
          {user.role}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile summary</CardTitle>
            <CardDescription>Key identifiers for this learner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border/60 px-3 py-2 text-sm">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{user.email}</p>
            </div>
            <div className="rounded-lg border border-border/60 px-3 py-2 text-sm">
              <p className="text-muted-foreground">Unique ID</p>
              <p className="font-medium text-foreground">
                {user.uniqueId || "Not set"}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              {user.year && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Year {user.year}</span>
                </div>
              )}
              {user.branch && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.branch}</span>
                </div>
              )}
              {user.organization?.name && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {user.organization.name}
                  </span>
                </div>
              )}
              {user.lastActiveAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Active {lastTimeAgo(user.lastActiveAt)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>
              Learning activity across assigned courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Average completion</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {avgCompletionRate}%
              </p>
              <p className="text-xs text-muted-foreground">
                Across {courseProgressData?.length || 0} courses
              </p>
            </div>
            <div className="rounded-lg border border-border/70 p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Assessments solved</span>
                <Award className="h-4 w-4 text-green-500" />
              </div>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {totalCompletedAssignments}
              </p>
              <p className="text-xs text-muted-foreground">
                Includes quizzes and code challenges
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>
            Administrative updates for this student.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            onClick={() => navigate(routes.USER_EDIT(userId || ""))}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit details
          </Button>
          {currentUser?.role === "ADMIN" && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate(routes.USER_EDIT_ROLE(userId || ""))}
              >
                <Shield className="mr-2 h-4 w-4" />
                Edit role
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  navigate(routes.USER_EDIT_ORGANIZATION(userId || ""))
                }
              >
                <Building2 className="mr-2 h-4 w-4" />
                Edit organization
              </Button>
            </>
          )}
          <Button
            variant={showDeleteConfirm ? "destructive" : "outline"}
            onClick={handleDeleteUser}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {showDeleteConfirm ? "Confirm delete" : "Delete student"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;
