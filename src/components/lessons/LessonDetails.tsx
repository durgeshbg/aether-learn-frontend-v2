import { getLessonById } from "@/services/lesson";
import { getModules } from "@/services/module";
import { routes } from "@/static-data/routes";
import { lessonKeys } from "@/tanstack/keys/lessonKeys";
import { moduleKeys } from "@/tanstack/keys/moduleKeys";
import type { Lesson } from "@/types/Lesson";
import type { Module } from "@/types/Module";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { deleteLesson } from "@/services/lesson";
import { useMutation } from "@tanstack/react-query";

import {
  PlayCircle,
  FileText,
  Layers,
  ArrowLeft,
  Clock,
  BookOpen,
  Edit3,
  Plus,
  Eye,
  CheckCircle,
  Users,
  Target,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";

// Helper function to get dummy lesson stats (replace with real data from backend)
const getLessonStats = (modules: Module[]) => ({
  totalModules: modules.length,
  estimatedDuration: `${Math.floor(Math.random() * 30) + 10} min`,
  completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
  enrolledStudents: Math.floor(Math.random() * 200) + 50,
  difficulty: ["Beginner", "Intermediate", "Advanced"][
    Math.floor(Math.random() * 3)
  ],
  lastUpdated: new Date().toLocaleDateString(),
});

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "text-green-400 bg-green-400/20 border-green-400/30";
    case "Intermediate":
      return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
    case "Advanced":
      return "text-red-400 bg-red-400/20 border-red-400/30";
    default:
      return "text-white/60 bg-white/10 border-white/20";
  }
};

const LessonDetails = () => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: lesson } = useSuspenseQuery({
    queryKey: lessonKeys.getById(courseId, lessonId),
    queryFn: async () => {
      return getLessonById(axiosInstance, { courseId, id: lessonId });
    },
    select: (data: { lesson: Lesson }) => data.lesson,
  });

  const { data: modules } = useSuspenseQuery({
    queryKey: moduleKeys.all(courseId, lessonId),
    queryFn: async () => {
      return getModules(axiosInstance, { courseId, lessonId });
    },
    select: (data: { modules: Module[] }) => data.modules,
  });

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

  const stats = getLessonStats(modules);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
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
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Lesson Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
                <PlayCircle className="h-10 w-10 text-white/80" />
              </div>

              {/* Lesson Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  {lesson.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-lg border font-semibold text-sm ${getDifficultyColor(stats.difficulty)}`}
                  >
                    {stats.difficulty}
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{stats.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Layers className="h-4 w-4" />
                    <span>{stats.totalModules} modules</span>
                  </div>
                </div>
                <p className="text-white/70 text-sm">
                  Last updated: {stats.lastUpdated}
                </p>
              </div>
            </div>

            {user?.role === "ADMIN" && (
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
                  onClick={() =>
                    navigate(routes.MODULE_CREATE(courseId, lessonId))
                  }
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Layers className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.totalModules}
              </div>
              <div className="text-white/70 text-sm">Modules</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.estimatedDuration}
              </div>
              <div className="text-white/70 text-sm">Duration</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.enrolledStudents}
              </div>
              <div className="text-white/70 text-sm">Students</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Target className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.completionRate}%
              </div>
              <div className="text-white/70 text-sm">Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content and Modules Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Lesson Content */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-2xl font-semibold mb-6 text-white">
            <FileText className="h-6 w-6 text-blue-400" />
            Lesson Content
          </h2>
          <div className="prose prose-invert max-w-none">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {lesson.content}
              </p>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
              <Layers className="h-6 w-6 text-emerald-400" />
              Modules ({modules.length})
            </h2>
            {user?.role === "ADMIN" && (
              <Button
                onClick={() =>
                  navigate(routes.MODULE_CREATE(courseId, lessonId))
                }
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-lg text-sm transition-all duration-300"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {modules.length === 0 ? (
              <div className="text-center py-12">
                <Layers className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/60 mb-2">
                  No Modules Yet
                </h3>
                <p className="text-white/40 text-sm mb-4">
                  Start building your lesson by adding modules
                </p>
                <Button
                  onClick={() =>
                    navigate(routes.MODULE_CREATE(courseId, lessonId))
                  }
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Module
                </Button>
              </div>
            ) : (
              modules.map((module, index) => (
                <Link
                  key={module.id}
                  to={routes.MODULE_DETAILS(courseId, lessonId, module.id)}
                  className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-emerald-300 transition-colors">
                        {module.title}
                      </div>
                      <div className="text-white/60 text-sm">
                        Module • Click to view details
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400/60" />
                      <Eye className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LessonDetails;
