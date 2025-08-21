import { routes } from "@/static-data/routes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { deleteCodeAssessment } from "@/services/code-assesment";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import {
  Code2,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  Settings,
  Terminal,
  Bug,
  Play,
  CheckCircle,
  Users,
  BookOpen,
  Zap,
  Target,
} from "lucide-react";

const CodeAssessments = () => {
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId: string;
  }>();
  const navigate = useNavigate();

  const handleEditCodeAssessment = () => {
    navigate(routes.CODE_ASSESSMENT_EDIT(courseId, codeAssessmentId));
  };

  const { mutate: deleteCodeAssessmentMutation, isPending: isDeleting } =
    useMutation({
      mutationKey: codeAssessmentKeys.delete(courseId, codeAssessmentId),
      mutationFn: async () => {
        return deleteCodeAssessment(axiosInstance, {
          courseId,
          id: codeAssessmentId,
        });
      },
      onSuccess: () => {
        navigate(routes.COURSE_DETAILS(courseId));
      },
      meta: {
        notify: true,
        successMessage: "Code Assessment deleted successfully",
        invalidatesQueries: codeAssessmentKeys.all(courseId),
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
              {/* Code Assessment Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
                <Code2 className="h-8 w-8 text-white/80" />
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Code Assessment Management
                </h1>
                <p className="text-white/70 text-lg">
                  Manage coding challenges, test cases, and programming
                  assessments
                </p>
              </div>
            </div>

            {/* Quick Stats (Optional - can be replaced with real data) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-white/70 text-sm">Test Cases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">45min</div>
                <div className="text-white/70 text-sm">Est. Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">78%</div>
                <div className="text-white/70 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
          <Settings className="h-5 w-5 text-emerald-400" />
          Assessment Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleEditCodeAssessment}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Assessment
          </Button>

          <Button
            onClick={() => deleteCodeAssessmentMutation()}
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
                Delete Assessment
              </>
            )}
          </Button>

          <Button
            onClick={() =>
              navigate(routes.TEST_CASE_CREATE(courseId, codeAssessmentId))
            }
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Test Case
          </Button>
        </div>

        {/* Action Info Cards */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Edit3 className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium text-sm">
                Edit Assessment
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Update problem description, instructions, and starter code
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Bug className="h-4 w-4 text-emerald-400" />
              <span className="text-white font-medium text-sm">
                Add Test Case
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Create input/output test cases to validate solutions
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              <span className="text-white font-medium text-sm">
                Delete Assessment
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Permanently remove this assessment and all test cases
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

      {/* Code Assessment Guide */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Code Assessment Best Practices
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Problem Design</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Write clear problem statements</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Provide comprehensive examples</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include edge cases in test data</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Set appropriate difficulty levels</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Test Case Strategy</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Cover basic functionality</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Test boundary conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include performance test cases</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Validate error handling</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Student Experience</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Provide helpful starter code</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Offer clear debugging feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Set realistic time constraints</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Allow multiple submissions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Assessment Features Overview */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Zap className="h-5 w-5 text-yellow-400" />
          Platform Features
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <Terminal className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Code Editor</div>
            <div className="text-white/60 text-xs">Syntax highlighting</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <Play className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Live Testing</div>
            <div className="text-white/60 text-xs">Real-time execution</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Auto-Grading</div>
            <div className="text-white/60 text-xs">Instant feedback</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <Users className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Analytics</div>
            <div className="text-white/60 text-xs">Performance tracking</div>
          </div>
        </div>
      </div>

      {/* Programming Languages Support */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Target className="h-5 w-5 text-purple-400" />
          Supported Languages
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {["Python", "JavaScript", "Java", "C++", "Go", "Rust"].map((lang) => (
            <div
              key={lang}
              className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="text-white font-medium text-sm">{lang}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">
          Create comprehensive coding assessments that effectively evaluate
          programming skills and problem-solving abilities
        </p>
      </div>
    </div>
  );
};

export default CodeAssessments;
