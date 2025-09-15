import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/tanstack/keys/userKeys";
import { getDashboardStats } from "@/services/user";
import { axiosInstance } from "@/utils/axiosInstance";
import lastTimeAgo from "@/utils/lastTimeAgo";

function OrganizationAdminDashboard() {
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

  const handleManageCourses = () => {
    navigate(routes.COURSES);
  };

  const handleViewAnalytics = () => {};

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-3 text-white">
        Organization Admin Dashboard
      </h1>
      <p className="text-white/80 mb-8 text-lg">
        Monitor your organization's learning progress, manage users, and track
        performance metrics.
      </p>

      {/* Organization Overview Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 text-blue-400" />
            <span className="text-sm text-white/70">Total</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardData?.usersCount}
          </div>
          <div className="text-white/80 text-sm">Organization Users</div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <span className="text-sm text-white/70">Active</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dashboardData?.coursesCount}
          </div>
          <div className="text-white/80 text-sm">Assigned Courses</div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-8 w-8 text-yellow-400" />
            <span className="text-sm text-white/70">Rate</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {averageCompletionRate}%
          </div>
          <div className="text-white/80 text-sm">Completion Rate</div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleManageUsers}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
          <Button
            onClick={handleManageCourses}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Assign Courses
          </Button>
          <Button
            onClick={handleViewAnalytics}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </section>

      {/* Course Performance & User Activity */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Top Performing Courses */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            Top Performing Courses
          </h2>
          <div className="space-y-4">
            {dashboardData?.top5CompletedCourses?.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <div className="font-medium text-white">{course.name}</div>
                  <div className="text-sm text-white/70">
                    {course.totalEnrollments} enrolled
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">
                    {course.averageCompletionRate}% completion
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent User Activity */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <Clock className="h-5 w-5 text-blue-400" />
            Recent User Activity
          </h2>
          <div className="space-y-4">
            {dashboardData?.recentlyUpdatedCourses?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <div className="font-medium text-white">{`${activity.user.firstName} ${activity.user.lastName}`}</div>
                  <div className="text-sm text-white/70">
                    {activity.course.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-semibold">
                    {activity.completionRate}% progress
                  </div>
                  <div className="text-xs text-white/60">
                    {lastTimeAgo(activity.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrganizationAdminDashboard;
