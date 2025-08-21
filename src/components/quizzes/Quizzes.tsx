import { deleteQuiz } from "@/services/quiz";
import { routes } from "@/static-data/routes";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Brain,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  Settings,
  HelpCircle,
  Timer,
  Users,
  Award,
  CheckCircle,
  BookOpen,
  BarChart3,
} from "lucide-react";

const Quizzes = () => {
  const { courseId = "", quizId = "" } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();

  const handleEditQuiz = () => {
    navigate(routes.QUIZ_EDIT(courseId, quizId));
  };

  const { mutate: deleteQuizMutation, isPending: isDeleting } = useMutation({
    mutationKey: quizKeys.delete(courseId, quizId),
    mutationFn: async () => {
      return deleteQuiz(axiosInstance, { courseId, id: quizId });
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Quiz deleted successfully",
      invalidatesQueries: quizKeys.all(courseId),
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
              {/* Quiz Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
                <Brain className="h-8 w-8 text-white/80" />
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Quiz Management
                </h1>
                <p className="text-white/70 text-lg">
                  Manage quiz questions, settings, and student assessments
                </p>
              </div>
            </div>

            {/* Quick Stats (Optional - can be replaced with real data) */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-white/70 text-sm">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">15min</div>
                <div className="text-white/70 text-sm">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">89%</div>
                <div className="text-white/70 text-sm">Pass Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
          <Settings className="h-5 w-5 text-purple-400" />
          Quiz Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleEditQuiz}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Quiz
          </Button>

          <Button
            onClick={() => deleteQuizMutation()}
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
                Delete Quiz
              </>
            )}
          </Button>

          <Button
            onClick={() => navigate(routes.QUESTION_CREATE(courseId, quizId))}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Action Info Cards */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Edit3 className="h-4 w-4 text-blue-400" />
              <span className="text-white font-medium text-sm">Edit Quiz</span>
            </div>
            <p className="text-white/70 text-xs">
              Update quiz title, description, and settings
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-white font-medium text-sm">
                Add Question
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Create new multiple choice questions for assessment
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="h-4 w-4 text-red-400" />
              <span className="text-white font-medium text-sm">
                Delete Quiz
              </span>
            </div>
            <p className="text-white/70 text-xs">
              Permanently remove this quiz and all questions
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

      {/* Quiz Management Guide */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <BookOpen className="h-5 w-5 text-blue-400" />
          Quiz Management Guide
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Question Design</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Write clear, unambiguous questions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Provide plausible incorrect options</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include helpful explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Test different difficulty levels</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Assessment Strategy</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Align with learning objectives</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Balance knowledge and application</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Set appropriate time limits</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Review performance analytics</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Student Experience</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Provide clear instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Offer immediate feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Allow multiple attempts if appropriate</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Track progress and completion</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quiz Features Overview */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Award className="h-5 w-5 text-yellow-400" />
          Quiz Platform Features
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <Timer className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Timed Quizzes</div>
            <div className="text-white/60 text-xs">Set time limits</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <BarChart3 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Analytics</div>
            <div className="text-white/60 text-xs">Performance tracking</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <CheckCircle className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">Auto-Grading</div>
            <div className="text-white/60 text-xs">Instant results</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <Users className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-white font-medium text-sm">
              Progress Tracking
            </div>
            <div className="text-white/60 text-xs">Student insights</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-white/50 text-sm">
          Create engaging assessments that effectively measure student
          understanding and progress
        </p>
      </div>
    </div>
  );
};

export default Quizzes;
