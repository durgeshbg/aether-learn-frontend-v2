import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  Layers,
  ArrowLeft,
  Settings,
  Plus,
  Eye,
  BookOpen,
  PlayCircle,
  FileText,
  Video,
  Code,
} from "lucide-react";

const Modules = () => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();

  const handleViewModules = () => {
    navigate(routes.LESSON_DETAILS(courseId, lessonId));
  };

  const handleCreateModule = () => {
    navigate(routes.MODULE_CREATE(courseId, lessonId));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Module Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center border border-white/20">
                <Layers className="h-8 w-8 text-white/80" />
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Module Management
                </h1>
                <p className="text-white/70 text-lg">
                  Create and organize learning modules within your lesson
                </p>
              </div>
            </div>

            {/* Quick Stats (Optional - can be replaced with real data) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-white/70 text-sm">Active Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">25min</div>
                <div className="text-white/70 text-sm">Total Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">156</div>
                <div className="text-white/70 text-sm">Completions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
          <Settings className="h-5 w-5 text-purple-400" />
          Module Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleViewModules}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Eye className="h-4 w-4 mr-2" />
            View All Modules
          </Button>
          <Button
            onClick={handleCreateModule}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Module
          </Button>
        </div>

        {/* Module Types Info */}
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium text-sm">
                Text Module
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Written content, explanations, and reading materials
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-purple-400" />
              <span className="text-white font-medium text-sm">
                Video Module
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Video lectures, demonstrations, and tutorials
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4 text-emerald-400" />
              <span className="text-white font-medium text-sm">
                Interactive
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Hands-on exercises and interactive content
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <PlayCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-white font-medium text-sm">Assessment</span>
            </div>
            <p className="text-white/70 text-xs">
              Quizzes, tests, and knowledge checkpoints
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

      {/* Module Design Guidelines */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Module Design Guidelines
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Content Structure</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Start with clear objectives</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Keep modules bite-sized (5-15 min)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include practical examples</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>End with summary and takeaways</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Engagement Tips</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Mix different content types</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Add interactive elements</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include knowledge checks</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Encourage active participation</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Technical Standards</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Ensure mobile compatibility</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Optimize for accessibility</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Test across devices</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Monitor loading times</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">
          Build engaging learning experiences with well-structured, interactive
          modules
        </p>
      </div>
    </div>
  );
};

export default Modules;
