import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { Users, Building, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-2 text-white">
        Super Admin Dashboard
      </h1>
      <p className="text-white/70 mb-8">
        Welcome to the admin dashboard! Manage organizations, users, and
        learning content easily.
      </p>

      {/* System Overview */}
      <section className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl flex flex-col items-center">
          <Building className="h-8 w-8 text-indigo-400 mb-2" />
          <div className="text-3xl font-semibold text-white">
            {dashboardData?.organizationsCount}
          </div>
          <div className="text-white/80">Organizations</div>
        </div>
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl flex flex-col items-center">
          <Users className="h-8 w-8 text-blue-400 mb-2" />
          <div className="text-3xl font-semibold text-white">
            {dashboardData?.usersCount}
          </div>
          <div className="text-white/80">Total Users</div>
        </div>
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl flex flex-col items-center">
          <BookOpen className="h-8 w-8 text-violet-400 mb-2" />
          <div className="text-3xl font-semibold text-white">
            {dashboardData?.coursesCount}
          </div>
          <div className="text-white/80">Total Courses</div>
        </div>
      </section>

      {/* Organization Management */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-2 text-white">
          <Building className="h-5 w-5 text-indigo-400" />
          Organization Management
        </h2>
        <div className="flex gap-4 items-center mb-3">
          <Button
            onClick={handleManageOrganizations}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg shadow"
          >
            Manage Organizations
          </Button>
        </div>
        <ul className="list-disc list-inside text-white/80 ml-6 text-base">
          <li>Create, edit, or deactivate organizations</li>
          <li>View all organizations and their admins</li>
          <li>Assign or revoke organization admin roles</li>
        </ul>
      </section>

      {/* Course Management */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-2 text-white">
          <BookOpen className="h-5 w-5 text-violet-400" />
          Course Management
        </h2>
        <div className="flex gap-4 items-center mb-3">
          <Button
            onClick={handleManageCourses}
            className="bg-violet-500 hover:bg-violet-600 text-white font-bold px-6 py-2 rounded-lg shadow"
          >
            Manage Courses
          </Button>
        </div>
        <div className="flex gap-10 items-center mb-3">
          <div className="flex flex-col items-center">
            {/* <div className="text-2xl font-bold text-white">{stats.courses}</div> */}
            <div className="text-white/70 text-xs">Courses in Library</div>
          </div>
        </div>
        <ul className="list-disc list-inside text-white/80 ml-6 text-base">
          <li>View/edit global course library</li>
          <li>Create and update courses</li>
          <li>Assign courses to organizations</li>
        </ul>
      </section>

      {/* User Management */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-2 text-white">
          <Users className="h-5 w-5 text-blue-400" />
          User Management
        </h2>
        <div className="flex gap-4 items-center mb-3">
          <Button
            onClick={handleManageUsers}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow"
          >
            Manage Users
          </Button>
        </div>
        <ul className="list-disc list-inside text-white/80 ml-6 text-base">
          <li>System-wide user search, invite, and deactivation</li>
          <li>Impersonate users for troubleshooting</li>
          <li>Assign system or organization roles</li>
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
