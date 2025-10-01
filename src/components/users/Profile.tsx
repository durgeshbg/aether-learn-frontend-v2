import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  Building2,
  Edit3,
  BookOpen,
  Trophy,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserById, getUserProgress } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { getCourseProgressStats } from "./helper";
import { useNavigate } from "react-router";
import { routes } from "@/static-data/routes";

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

  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and track your progress
            </p>
          </div>
          <Button
            onClick={() => handleEditClick(user?.id || "")}
            className="bg-primary/90 hover:bg-primary backdrop-blur-sm shadow-lg shadow-primary/25"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 overflow-hidden sticky top-6">
              {/* Profile Header */}
              <div className="relative p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative text-center">
                  {/* <div className="relative mx-auto w-32 h-32 mb-4 group"> */}
                  {/*   <img */}
                  {/*     src={user.avatar} */}
                  {/*     alt={`${user.firstName} ${user.lastName}`} */}
                  {/*     className="w-full h-full rounded-full bg-muted border-4 border-background shadow-xl" */}
                  {/*   /> */}
                  {/* </div> */}

                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-muted-foreground mb-4">{user.email}</p>

                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {user.role}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 space-y-4">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600">
                    {user.streakCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Day Streak
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">
                      {user.organization?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{user.branch}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      First Name
                    </label>
                    <p className="mt-1 text-foreground font-medium">
                      {user.firstName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Name
                    </label>
                    <p className="mt-1 text-foreground font-medium">
                      {user.lastName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Graduation Year
                    </label>
                    <p className="mt-1 text-foreground font-medium">
                      {user.year || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground font-medium">
                        {user.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Student ID
                    </label>
                    <p className="mt-1 text-foreground font-medium font-mono text-sm bg-muted/20 px-3 py-2 rounded-lg">
                      #{user.uniqueId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Progress */}
            <div className="rounded-2xl bg-card/40 backdrop-blur-md border border-border/20 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Academic Progress
              </h3>

              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                  <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-600">
                    {avgCompletionRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg. Completion Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
