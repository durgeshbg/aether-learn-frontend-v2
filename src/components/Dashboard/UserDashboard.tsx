import {
  BookOpen,
  Play,
  Award,
  TrendingUp,
  Target,
  FileText,
  Code,
  Activity,
} from "lucide-react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/tanstack/keys/userKeys";
import { useAuth } from "@/hooks/useAuth";
import { /* getDashboardStats, */ getUserProgress } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { useNavigate } from "react-router";
import { getModuleLink } from "@/utils/getModuleLink";
import type { CourseProgress, ModuleLink } from "@/types/User";
import { completionStats, courseCompletiondata } from "./helpers";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { getCourses } from "@/services/course";
import { routes } from "@/static-data/routes";

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

  // const { data: dashboardData } = useQuery({
  //   queryKey: userKeys.dashBoardStats(),
  //   queryFn: async () => {
  //     return getDashboardStats(axiosInstance);
  //   },
  //   select: (data) => data.dashboardData,
  // });

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
    ? sumCompletionRate / totalEnrolledCoursesCount
    : 0;

  const handleContinueLearning = (moduleLink: ModuleLink | null) => {
    navigate(getModuleLink(moduleLink));
  };

  const handleSubmissionClick = (progress: CourseProgress) => {
    navigate(routes.COURSE_SUBMISSIONS(progress.course.id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-3 text-white">
        Your Learning Dashboard
      </h1>
      <p className="text-white/80 mb-8 text-lg">
        Welcome back! Continue your learning journey and track your progress.
      </p>

      {/* Performance Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div
          className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl col-span-full"
          style={{ width: "100%" }}
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-sm text-white/70 font-semibold">
              Progress
            </span>
          </div>
          <div className="text-4xl font-extrabold text-white mb-2">
            {overallProgress}%
          </div>
          <div className="text-white/80 text-sm mb-6">Overall Progress</div>
          <div className="flex justify-between space-x-4 flex-wrap gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <BookOpen className="text-blue-400 h-5 w-5" />
              <span className="text-white/80">Modules:</span>
              <span className="bg-blue-400/20 text-blue-400 rounded-full px-3 py-1 text-xs font-medium">
                {completedModules}/{totalModules}
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <FileText className="text-blue-400 h-5 w-5" />
              <span className="text-white/80">Quizzes:</span>
              <span className="bg-blue-400/20 text-blue-400 rounded-full px-3 py-1 text-xs font-medium">
                {completedQuizzes}/{totalQuizzes}
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <Code className="text-blue-400 h-5 w-5" />
              <span className="text-white/80">Code Assessments:</span>
              <span className="bg-blue-400/20 text-blue-400 rounded-full px-3 py-1 text-xs font-medium">
                {completedCodeAssessments}/{totalCodeAssessments}
              </span>
            </div>
          </div>
        </div>

        {/* TODO: fetch average score from backend from quiz results and code solutions */}
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-8 w-8 text-yellow-400" />
            <span className="text-sm text-white/70">Score</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {userStats.averageScore}%
          </div>
          <div className="text-white/80 text-sm">Average Score</div>
          <div className="text-green-400 text-xs mt-1">+3% this month</div>
        </div>
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Target className="h-8 w-8 text-emerald-400" />
            <span className="text-sm text-white/70">Completed</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {completedCoursesCount}
          </div>
          <div className="text-white/80 text-sm">Courses Completed</div>
          <div className="text-white/60 text-xs mt-1">
            of {totalEnrolledCoursesCount} enrolled
          </div>
        </div>
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Activity className="h-8 w-8 text-purple-400" />
            <span className="text-sm text-white/70">Streak</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {user?.streakCount || 0}
          </div>
          <div className="text-white/80 text-sm">Day Streak</div>
          <div className="text-purple-400 text-xs mt-1">
            Last updated {lastTimeAgo(user?.lastActiveAt || "")}
          </div>
        </div>
      </section>

      {/* Course Progress Overview */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-10">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-white">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Course Progress Overview
        </h2>
        <div className="grid gap-4">
          {progressData?.map((progress) => (
            <div
              key={progress.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">
                    {progress.course.name}
                  </h3>
                  <p className="text-sm text-white/70">
                    <div className="flex items-center justify-between w-full">
                      <div>Last accessed {lastTimeAgo(progress.updatedAt)}</div>
                    </div>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-400">
                    {progress.completionRate}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">
                  Next: {progress.nextModule?.title}
                </span>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleSubmissionClick(progress)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Submissions
                  </Button>

                  <Button
                    onClick={() => handleContinueLearning(progress.nextModule)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;
