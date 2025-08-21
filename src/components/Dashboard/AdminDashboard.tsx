import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
// You may use any icon set your project config supports:
import { Users, Building, BookOpen, Layers, FileText } from "lucide-react";

const stats = {
  organizations: 12,
  users: 864,
  health: "Operational",
  courses: 31,
  lessons: 146,
  quizzes: 47,
  codeAssessments: 15,
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleManageUsers = () => navigate(routes.USERS);
  const handleManageOrganizations = () => navigate(routes.ORGANIZATIONS);

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-2 text-white">
        Super Admin Dashboard
      </h1>
      <p className="text-white/70 mb-8">
        Welcome to the admin dashboard! Monitor system health and manage
        organizations, users, and learning content easily.
      </p>

      {/* System Overview */}
      <section className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl flex flex-col items-center">
          <Building className="h-8 w-8 text-indigo-400 mb-2" />
          <div className="text-3xl font-semibold text-white">
            {stats.organizations}
          </div>
          <div className="text-white/80">Organizations</div>
        </div>
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl flex flex-col items-center">
          <Users className="h-8 w-8 text-blue-400 mb-2" />
          <div className="text-3xl font-semibold text-white">{stats.users}</div>
          <div className="text-white/80">Total Users</div>
        </div>
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl flex flex-col items-center">
          <Layers className="h-8 w-8 text-green-400 mb-2" />
          <div className="text-xl font-semibold text-green-400">
            {stats.health}
          </div>
          <div className="text-white/80">System Health</div>
        </div>
      </section>

      {/* Admin Actions */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-10">
        <h2 className="text-xl font-semibold mb-2 text-white">Quick Actions</h2>
        <div className="mb-4 text-white/80">
          Manage users and organizations.
        </div>
        <div className="flex gap-4">
          <Button
            onClick={handleManageUsers}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg shadow"
          >
            Manage Users
          </Button>
          <Button
            onClick={handleManageOrganizations}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow"
          >
            Manage Organizations
          </Button>
        </div>
      </section>

      {/* Organization Management */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-2 text-white">
          <Building className="h-5 w-5 text-indigo-400" />
          Organization Management
        </h2>
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
        <div className="flex gap-10 items-center mb-3">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-white">{stats.courses}</div>
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
        <ul className="list-disc list-inside text-white/80 ml-6 text-base">
          <li>System-wide user search, invite, and deactivation</li>
          <li>Impersonate users for troubleshooting</li>
          <li>Assign system or organization roles</li>
        </ul>
      </section>

      {/* Content Management */}
      <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-2 text-white">
          <FileText className="h-5 w-5 text-emerald-400" />
          Content Management
        </h2>
        <div className="flex gap-8 mb-3">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-white">{stats.lessons}</div>
            <div className="text-sm text-white/70">Lessons</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-white">{stats.quizzes}</div>
            <div className="text-sm text-white/70">Quizzes</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold text-white">
              {stats.codeAssessments}
            </div>
            <div className="text-sm text-white/70">Code Assessments</div>
          </div>
        </div>
        <ul className="list-disc list-inside text-white/80 ml-6 text-base">
          <li>View and manage all lessons, quizzes, and code assessments</li>
          <li>Approve or reject content updates</li>
          <li>Assign content to specific courses or organizations</li>
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
