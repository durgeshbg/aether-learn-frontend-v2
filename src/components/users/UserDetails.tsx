import { deleteUser, getUserById, getUserProgress } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  ArrowLeft,
  GraduationCap,
  Edit3,
  Trash2,
  Shield,
  Building2,
  Trophy,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useMemo, useState } from "react";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { getCourseProgressStats, getProgressColor } from "./helper";

// Enhanced user data for better display
// const enhanceUserData = (user: User) => ({
//   ...user,
//   avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
//   quizScore: 85,
//   codingProblems: 45,
// });

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    [courseProgressData],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(routes.USERS)}
          className="p-2 hover:bg-card/40 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Student Profile
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 overflow-hidden">
            {/* Profile Header */}
            <div className="relative p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative text-center">
                {/* <div className="relative mx-auto w-24 h-24 mb-4"> */}
                {/*   <img */}
                {/*     src={user.avatar} */}
                {/*     alt={`${user.firstName} ${user.lastName}`} */}
                {/*     className="w-full h-full rounded-full bg-muted border-4 border-background shadow-lg" */}
                {/*   /> */}
                {/* </div> */}
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground text-sm mb-3">
                  {user.email}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {user.role}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 space-y-4">
              <div className="text-center p-3 rounded-xl bg-muted/20 text-2xl font-bold text-primary">
                #{user.uniqueId}
              </div>

              <div className="space-y-3">
                {user.year && (
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Year {user.year || "N/A"}
                    </span>
                  </div>
                )}
                {user.organization && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {user.organization?.name}
                    </span>
                  </div>
                )}
                {user.branch && (
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{user.branch}</span>
                  </div>
                )}
                {user.lastActiveAt && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      Active {lastTimeAgo(user.lastActiveAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Performance */}
          <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Academic Performance
            </h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/10 border border-border/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Average Completion Rate
                  </span>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {avgCompletionRate}%
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(avgCompletionRate)}`}
                    style={{ width: `${avgCompletionRate}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {`Across ${courseProgressData?.length || 0} courses`}
                </div>
              </div>

              {/* <div className="p-4 rounded-xl bg-muted/10 border border-border/10"> */}
              {/*   <div className="flex items-center justify-between mb-2"> */}
              {/*     <span className="text-sm text-muted-foreground"> */}
              {/*       Quiz Average */}
              {/*     </span> */}
              {/*     <Star className="h-4 w-4 text-blue-500" /> */}
              {/*   </div> */}
              {/*   <div className="text-2xl font-bold text-foreground mb-1"> */}
              {/*     {10}% */}
              {/*   </div> */}
              {/*   <div className="text-xs text-muted-foreground"> */}
              {/*     Last {totalCompletedQuizzes} quizzes */}
              {/*   </div> */}
              {/* </div> */}

              <div className="p-4 rounded-xl bg-muted/10 border border-border/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Coding Assessments Solved
                  </span>
                  <Award className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {totalCompletedAssignments}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />
              Management Actions
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="bg-blue-500/10 border-blue-500/20 text-blue-700 hover:bg-blue-500/20"
                onClick={() => navigate(routes.USER_EDIT(userId || ""))}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Details
              </Button>

              <Button
                variant="outline"
                className="bg-green-500/10 border-green-500/20 text-green-700 hover:bg-green-500/20"
                onClick={() => navigate(routes.USER_EDIT_ROLE(userId || ""))}
              >
                <Shield className="h-4 w-4 mr-2" />
                Edit Role
              </Button>

              <Button
                variant="outline"
                className="bg-purple-500/10 border-purple-500/20 text-purple-700 hover:bg-purple-500/20"
                onClick={() =>
                  navigate(routes.USER_EDIT_ORGANIZATION(userId || ""))
                }
              >
                <Building2 className="h-4 w-4 mr-2" />
                Edit Organization
              </Button>

              <Button
                variant="outline"
                className={`transition-all duration-300 ${
                  showDeleteConfirm
                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                    : "bg-red-500/10 border-red-500/20 text-red-700 hover:bg-red-500/20"
                }`}
                onClick={handleDeleteUser}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {showDeleteConfirm ? "Confirm Delete" : "Delete Student"}
              </Button>
            </div>

            {showDeleteConfirm && (
              <p className="text-sm text-red-600 mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                ⚠️ Click "Confirm Delete" again to permanently remove this
                student. This action cannot be undone.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
