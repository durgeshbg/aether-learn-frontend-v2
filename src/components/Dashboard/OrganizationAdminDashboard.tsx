import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  Users,
  BookOpen,
  TrendingUp,
  Activity,
  Award,
  Clock,
  Target,
  BarChart3,
  UserCheck,
} from "lucide-react";

const orgStats = {
  totalUsers: 127,
  activeCourses: 8,
  completionRate: 73,
  avgProgress: 68,
  activeUsers: 89,
  totalLessons: 156,
  completedLessons: 1142,
  avgTimeSpent: "4.2h",
};

const recentActivity = [
  {
    user: "Sarah Johnson",
    course: "React Fundamentals",
    progress: 85,
    lastActive: "2 hours ago",
  },
  {
    user: "Mike Chen",
    course: "JavaScript Advanced",
    progress: 92,
    lastActive: "5 hours ago",
  },
  {
    user: "Emma Davis",
    course: "Node.js Backend",
    progress: 67,
    lastActive: "1 day ago",
  },
  {
    user: "Alex Rivera",
    course: "React Fundamentals",
    progress: 45,
    lastActive: "3 days ago",
  },
];

const topPerformingCourses = [
  { name: "React Fundamentals", enrolled: 45, completion: 78, avgScore: 87 },
  { name: "JavaScript Advanced", enrolled: 32, completion: 85, avgScore: 91 },
  { name: "Node.js Backend", enrolled: 28, completion: 65, avgScore: 82 },
  { name: "Python Basics", enrolled: 22, completion: 90, avgScore: 88 },
];

function OrganizationAdminDashboard() {
  const navigate = useNavigate();

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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 text-blue-400" />
            <span className="text-sm text-white/70">Total</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {orgStats.totalUsers}
          </div>
          <div className="text-white/80 text-sm">Organization Users</div>
          <div className="text-green-400 text-xs mt-1">+12 this month</div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <span className="text-sm text-white/70">Active</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {orgStats.activeCourses}
          </div>
          <div className="text-white/80 text-sm">Assigned Courses</div>
          <div className="text-blue-400 text-xs mt-1">
            {orgStats.totalLessons} total lessons
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Award className="h-8 w-8 text-yellow-400" />
            <span className="text-sm text-white/70">Rate</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {orgStats.completionRate}%
          </div>
          <div className="text-white/80 text-sm">Completion Rate</div>
          <div className="text-green-400 text-xs mt-1">+5% from last month</div>
        </div>

        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Activity className="h-8 w-8 text-emerald-400" />
            <span className="text-sm text-white/70">Active</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {orgStats.activeUsers}
          </div>
          <div className="text-white/80 text-sm">Active Learners</div>
          <div className="text-white/60 text-xs mt-1">
            Avg: {orgStats.avgTimeSpent}/week
          </div>
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
            {topPerformingCourses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <div className="font-medium text-white">{course.name}</div>
                  <div className="text-sm text-white/70">
                    {course.enrolled} enrolled
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">
                    {course.completion}% completion
                  </div>
                  <div className="text-xs text-white/60">
                    Avg score: {course.avgScore}%
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
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div>
                  <div className="font-medium text-white">{activity.user}</div>
                  <div className="text-sm text-white/70">{activity.course}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-semibold">
                    {activity.progress}% progress
                  </div>
                  <div className="text-xs text-white/60">
                    {activity.lastActive}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Management Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* User Management */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-3 text-white">
            <UserCheck className="h-5 w-5 text-blue-400" />
            User Management
          </h2>
          <ul className="list-disc list-inside text-white/80 ml-6 space-y-2">
            <li>Add or remove organization members</li>
            <li>Assign course access and permissions</li>
            <li>View individual user progress and performance</li>
            <li>Send notifications and announcements</li>
          </ul>
        </section>

        {/* Analytics & Monitoring */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-3 text-white">
            <Target className="h-5 w-5 text-emerald-400" />
            Analytics & Monitoring
          </h2>
          <ul className="list-disc list-inside text-white/80 ml-6 space-y-2">
            <li>Track organization-wide performance metrics</li>
            <li>Monitor user engagement and activity patterns</li>
            <li>Generate progress reports and completion certificates</li>
            <li>Identify learning trends and areas for improvement</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default OrganizationAdminDashboard;
