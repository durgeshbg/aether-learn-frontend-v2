import { deleteQuestion, getQuestions } from "@/services/question";
import { deleteQuiz, getQuiz } from "@/services/quiz";
import { questionKeys } from "@/tanstack/keys/question";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import type { Question } from "@/types/Question";
import type { Quiz } from "@/types/Quiz";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  Brain,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  FileText,
  Target,
  Users,
  Clock,
  Award,
} from "lucide-react";

interface AdminQuizDetailsProps {
  courseId: string;
  quizId: string;
}

export const AdminQuizDetails = ({
  courseId,
  quizId,
}: AdminQuizDetailsProps) => {
  const navigate = useNavigate();

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data: { quiz: Quiz }) => data.quiz,
  });

  const { data: questions } = useSuspenseQuery({
    queryKey: questionKeys.all(courseId, quizId),
    queryFn: async () => {
      return getQuestions(axiosInstance, { courseId, quizId });
    },
    select: (data: { questions: Question[] }) => data?.questions,
  });

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

  const { mutate: deleteQuestionMutation, isPending: isDeletingQuestion } =
    useMutation({
      mutationKey: questionKeys.delete(courseId, quizId, "delete"),
      mutationFn: async (questionId: string) => {
        return deleteQuestion(axiosInstance, {
          courseId,
          quizId,
          id: questionId,
        });
      },
      meta: {
        notify: true,
        successMessage: "Question deleted successfully",
        invalidatesQueries: questionKeys.all(courseId, quizId),
      },
    });

  // Helper function to get dummy quiz stats (replace with real data from backend)
  const getQuizStats = () => ({
    totalQuestions: questions?.length || 0,
    estimatedDuration: `${Math.floor((questions?.length || 0) * 1.5)} min`,
    difficulty: ["Beginner", "Intermediate", "Advanced"][
      Math.floor(Math.random() * 3)
    ],
    completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
    averageScore: Math.floor(Math.random() * 30) + 70, // 70-100%
    totalAttempts: Math.floor(Math.random() * 200) + 50,
  });

  const stats = getQuizStats();

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
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {/* Quiz Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
                <Brain className="h-10 w-10 text-white/80" />
              </div>

              {/* Quiz Info */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  {quiz.title}
                </h1>
                <p className="text-white/80 text-lg mb-4">{quiz.description}</p>
                <div className="flex items-center gap-4">
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
                    <HelpCircle className="h-4 w-4" />
                    <span>{stats.totalQuestions} questions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
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
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <HelpCircle className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.totalQuestions}
              </div>
              <div className="text-white/70 text-sm">Questions</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Users className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.totalAttempts}
              </div>
              <div className="text-white/70 text-sm">Attempts</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Award className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.averageScore}%
              </div>
              <div className="text-white/70 text-sm">Avg Score</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Target className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {stats.completionRate}%
              </div>
              <div className="text-white/70 text-sm">Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Management */}
      <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <HelpCircle className="h-6 w-6 text-purple-400" />
            Quiz Questions ({questions?.length || 0})
          </h2>
          <Button
            onClick={() => navigate(routes.QUESTION_CREATE(courseId, quizId))}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 px-4 py-2 rounded-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions?.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="h-20 w-20 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white/60 mb-2">
                No Questions Yet
              </h3>
              <p className="text-white/40 text-sm mb-6">
                Start building your quiz by adding questions for students to
                answer
              </p>
              <Button
                onClick={() =>
                  navigate(routes.QUESTION_CREATE(courseId, quizId))
                }
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Question
              </Button>
            </div>
          ) : (
            questions?.map((question, index) => (
              <div
                key={question.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Question Number */}
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    {/* Question Text */}
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {question.text}
                    </h3>

                    {/* Answer Options */}
                    <div className="grid md:grid-cols-2 gap-2 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                            question.answer === optionIndex + 1
                              ? "bg-green-500/20 border-green-400/30 text-green-400"
                              : "bg-white/5 border-white/10 text-white/80"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              question.answer === optionIndex + 1
                                ? "bg-green-500 text-white"
                                : "bg-white/20 text-white/70"
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <span className="text-sm">{option}</span>
                          {question.answer === optionIndex + 1 && (
                            <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    {question.explaination && (
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-400 text-sm font-medium">
                            Explanation
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">
                          {question.explaination}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          navigate(
                            routes.QUESTION_EDIT(courseId, quizId, question.id),
                          )
                        }
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 px-4 py-2 rounded-lg text-sm transition-all duration-300"
                      >
                        <Edit3 className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteQuestionMutation(question.id)}
                        disabled={isDeletingQuestion}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 px-4 py-2 rounded-lg text-sm transition-all duration-300 disabled:opacity-50"
                      >
                        {isDeletingQuestion ? (
                          <>
                            <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
