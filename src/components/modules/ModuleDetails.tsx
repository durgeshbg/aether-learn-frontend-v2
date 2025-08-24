import { deleteModule, getModuleById } from "@/services/module";
import { moduleKeys } from "@/tanstack/keys/moduleKeys";
import type { Module } from "@/types/Module";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { LANGUAGES_MAP } from "@/static-data/languages";
import {
  Layers,
  Edit3,
  Trash2,
  ArrowLeft,
  FileText,
  Code2,
  Globe,
  Clock,
  Eye,
  Users,
  CheckCircle,
  Play,
  Bookmark,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Helper function to get dummy module stats (replace with real data from backend)
const getModuleStats = () => ({
  estimatedDuration: `${Math.floor(Math.random() * 15) + 5} min`,
  completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
  viewCount: Math.floor(Math.random() * 500) + 100,
  studentsCompleted: Math.floor(Math.random() * 100) + 20,
  difficulty: ["Beginner", "Intermediate", "Advanced"][
    Math.floor(Math.random() * 3)
  ],
  lastUpdated: new Date().toLocaleDateString(),
  moduleType: ["Text", "Video", "Interactive", "Code"][
    Math.floor(Math.random() * 4)
  ],
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

const getModuleTypeIcon = (type: string) => {
  switch (type) {
    case "Video":
      return <Play className="h-5 w-5" />;
    case "Interactive":
      return <Settings className="h-5 w-5" />;
    case "Code":
      return <Code2 className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const getModuleTypeColor = (type: string) => {
  switch (type) {
    case "Video":
      return "text-purple-400 bg-purple-400/20";
    case "Interactive":
      return "text-emerald-400 bg-emerald-400/20";
    case "Code":
      return "text-blue-400 bg-blue-400/20";
    default:
      return "text-white/80 bg-white/10";
  }
};

const ModuleDetails = () => {
  const {
    courseId = "",
    lessonId = "",
    moduleId = "",
  } = useParams<{
    courseId: string;
    lessonId: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: module } = useSuspenseQuery({
    queryKey: moduleKeys.getById(courseId, lessonId, moduleId),
    queryFn: async () => {
      return getModuleById(axiosInstance, { courseId, lessonId, id: moduleId });
    },
    select: (data: { module: Module }) => data.module,
  });

  const { mutate: deleteModuleMutation, isPending: isDeleting } = useMutation({
    mutationKey: moduleKeys.delete(courseId, lessonId, moduleId),
    mutationFn: async () => {
      return deleteModule(axiosInstance, { courseId, lessonId, id: moduleId });
    },
    onSuccess: () => {
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    },
    meta: {
      notify: true,
      successMessage: "Module deleted successfully",
      invalidatesQueries: moduleKeys.all(courseId, lessonId),
    },
  });

  const stats = getModuleStats();
  const language = LANGUAGES_MAP[module.languageId];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() => navigate(routes.LESSON_DETAILS(courseId, lessonId))}
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lesson
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Module Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center border border-white/20">
                <Layers className="h-10 w-10 text-white/80" />
              </div>

              {/* Module Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  {module.title}
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
                </div>
                <p className="text-white/70 text-sm">
                  Last updated: {stats.lastUpdated}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 px-4 py-2 rounded-lg text-sm transition-all duration-300">
                <Bookmark className="h-3 w-3 mr-2" />
                Bookmark
              </Button>
              {user?.role === "ADMIN" && (
                <>
                  <Button
                    onClick={() =>
                      navigate(routes.MODULE_EDIT(courseId, lessonId, moduleId))
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => deleteModuleMutation()}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Eye className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.viewCount}
              </div>
              <div className="text-white/70 text-sm">Views</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Users className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.studentsCompleted}
              </div>
              <div className="text-white/70 text-sm">Completed</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.completionRate}%
              </div>
              <div className="text-white/70 text-sm">Success Rate</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.estimatedDuration}
              </div>
              <div className="text-white/70 text-sm">Duration</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content and Details Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Module Content */}
        <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <h2 className="flex items-center gap-2 text-2xl font-semibold mb-6 text-white">
            <FileText className="h-6 w-6 text-blue-400" />
            Module Content
          </h2>
          <div className="prose prose-invert max-w-none">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 mb-6">
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {module.content}
              </p>
            </div>
          </div>
        </section>

        {/* Code and Technical Details */}
        <section className="space-y-6">
          {/* Code Section */}
          {module.code && (
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
              <h2 className="flex items-center gap-2 text-2xl font-semibold mb-6 text-white">
                <Code2 className="h-6 w-6 text-emerald-400" />
                Code Example
              </h2>
              <div className="relative">
                <div className="absolute top-3 right-3 z-10">
                  {language && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white/80 text-sm">
                      <Globe className="h-3 w-3" />
                      {language.label}
                    </div>
                  )}
                </div>
                <pre className="p-6 rounded-xl bg-gray-900/50 border border-white/10 text-white/90 text-sm overflow-x-auto leading-relaxed">
                  <code>{module.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Module Metadata */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h2 className="flex items-center gap-2 text-2xl font-semibold mb-6 text-white">
              <Settings className="h-6 w-6 text-purple-400" />
              Module Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/70">Module Type</span>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-sm ${getModuleTypeColor(stats.moduleType)}`}
                >
                  {getModuleTypeIcon(stats.moduleType)}
                  {stats.moduleType}
                </div>
              </div>

              {language && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/70">Programming Language</span>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Globe className="h-4 w-4 text-blue-400" />
                    {language.label}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/70">Difficulty Level</span>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-lg border font-semibold text-sm ${getDifficultyColor(stats.difficulty)}`}
                >
                  {stats.difficulty}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/70">Estimated Duration</span>
                <div className="flex items-center gap-2 text-white font-medium">
                  <Clock className="h-4 w-4 text-purple-400" />
                  {stats.estimatedDuration}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ModuleDetails;
