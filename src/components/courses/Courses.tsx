import { Outlet, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { BookOpen, Plus, Library, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate(routes.COURSE_CREATE);
  };

  const handleViewCourses = () => {
    navigate(routes.COURSES);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Course Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/20">
                <GraduationCap className="h-8 w-8 text-white/80" />
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Courses</h1>
                <p className="text-white/70 text-lg">
                  Manage your learning content and educational materials
                </p>
              </div>
            </div>

            {/* Quick Stats (Optional - can be replaced with real data) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-white/70 text-sm">Active Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">156</div>
                <div className="text-white/70 text-sm">Total Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1.2k</div>
                <div className="text-white/70 text-sm">Enrollments</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Actions */}

      {user?.role === "ADMIN" && (
        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Course Management
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleViewCourses}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
            >
              <Library className="h-4 w-4 mr-2" />
              View All Courses
            </Button>
            <Button
              onClick={handleAddCourse}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </div>
          Additional Info
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/70 text-sm">
              <strong className="text-white">Quick Tip:</strong> Use "Create New
              Course" to add educational content, or "View All Courses" to
              manage existing courses, lessons, and assessments.
            </p>
          </div>
        </div>
      )}
      {/* Content Area */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden min-h-[400px]">
        <div className="p-1">
          <Outlet />
        </div>
      </div>
      {/* Footer Info (Optional) */}
      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">
          Build comprehensive learning experiences with interactive lessons,
          quizzes, and assessments
        </p>
      </div>
    </div>
  );
};

export default Courses;
