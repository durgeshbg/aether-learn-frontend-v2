import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { deleteLesson } from "@/services/lesson";
import { axiosInstance } from "@/utils/axiosInstance";
import { lessonKeys } from "@/tanstack/keys/lessonKeys";
import { useMutation } from "@tanstack/react-query";
import {
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  Settings,
  PlayCircle,
  Layers,
  FileText,
} from "lucide-react";

const Lessons = () => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const handleEditLesson = () => {
    navigate(routes.LESSON_EDIT(courseId, lessonId));
  };

  const { mutate: deleteLessonMutation, isPending: isDeleting } = useMutation({
    mutationKey: lessonKeys.delete(courseId, lessonId),
    mutationFn: async () => {
      return deleteLesson(axiosInstance, { courseId, id: lessonId });
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Lesson deleted successfully",
      invalidatesQueries: lessonKeys.all(courseId),
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Lesson Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
                <PlayCircle className="h-8 w-8 text-white/80" />
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Lesson Management
                </h1>
                <p className="text-white/70 text-lg">
                  Manage lesson content, modules, and educational materials
                </p>
              </div>
            </div>

            {/* Quick Stats (Optional - can be replaced with real data) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-white/70 text-sm">Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">45min</div>
                <div className="text-white/70 text-sm">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">127</div>
                <div className="text-white/70 text-sm">Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
          <Settings className="h-5 w-5 text-blue-400" />
          Lesson Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleEditLesson}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Lesson
          </Button>

          <Button
            onClick={() => deleteLessonMutation()}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Lesson
              </>
            )}
          </Button>

          <Button
            onClick={() => navigate(routes.MODULE_CREATE(courseId, lessonId))}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Edit3 className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium text-sm">
                Edit Lesson
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Update lesson title, description, and settings
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="text-white font-medium text-sm">Add Module</span>
            </div>
            <p className="text-white/70 text-xs">
              Create content modules within this lesson
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              <span className="text-white font-medium text-sm">
                Delete Lesson
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Permanently remove this lesson and all modules
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden min-h-[500px]">
        <div className="p-1">
          <Outlet />
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <FileText className="h-5 w-5 text-purple-400" />
          Lesson Structure Guide
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-2">Best Practices</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• Keep lessons focused on a single topic</li>
              <li>• Break complex topics into multiple modules</li>
              <li>• Include interactive elements and assessments</li>
              <li>• Provide clear learning objectives</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Module Types</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• Text content for explanations</li>
              <li>• Video modules for demonstrations</li>
              <li>• Interactive exercises for practice</li>
              <li>• Quizzes for knowledge validation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">
          Structure your lesson with engaging modules to create effective
          learning experiences
        </p>
      </div>
    </div>
  );
};

export default Lessons;
