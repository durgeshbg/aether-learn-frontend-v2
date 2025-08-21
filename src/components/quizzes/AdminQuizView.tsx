import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { deleteQuestion } from "@/services/question";
import { questionKeys } from "@/tanstack/keys/question";
import { axiosInstance } from "@/utils/axiosInstance";
import { routes } from "@/static-data/routes";
import { Button } from "../ui/button";
import type { Question } from "@/types/Question";
import type { Quiz } from "@/types/Quiz";
import {
  Brain,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  Users,
  Timer,
  Target,
  Settings,
} from "lucide-react";

interface AdminQuizViewProps {
  quiz: Quiz;
  questions: Question[];
  courseId: string;
  quizId: string;
}

export const AdminQuizView = ({
  quiz,
  questions,
  courseId,
  quizId,
}: AdminQuizViewProps) => {
  const navigate = useNavigate();
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null,
  );

  const { mutate: deleteQuestionMutation } = useMutation({
    mutationKey: questionKeys.delete(courseId, quizId, "delete"),
    mutationFn: async (questionId: string) => {
      setDeletingQuestionId(questionId);
      return deleteQuestion(axiosInstance, {
        courseId,
        quizId,
        id: questionId,
      });
    },
    onSettled: () => {
      setDeletingQuestionId(null);
    },
    meta: {
      notify: true,
      successMessage: "Question deleted successfully",
      invalidatesQueries: questionKeys.all(courseId, quizId),
    },
  });

  // Calculate quiz statistics
  const quizStats = {
    totalQuestions: questions.length,
    estimatedTime: Math.max(5, questions.length * 2), // 2 minutes per question, minimum 5
    averageOptions:
      questions.length > 0
        ? Math.round(
            questions.reduce((sum, q) => sum + q.options.length, 0) /
              questions.length,
          )
        : 0,
    completionRate: Math.floor(Math.random() * 40) + 60, // Mock data - replace with real
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
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Timer className="h-4 w-4" />
                    <span>~{quizStats.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <HelpCircle className="h-4 w-4" />
                    <span>{quizStats.totalQuestions} questions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(routes.QUIZ_EDIT(courseId, quizId))}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Quiz
              </Button>
              <Button
                onClick={() =>
                  navigate(routes.QUESTION_CREATE(courseId, quizId))
                }
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <HelpCircle className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {quizStats.totalQuestions}
              </div>
              <div className="text-white/70 text-sm">Questions</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Timer className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {quizStats.estimatedTime}m
              </div>
              <div className="text-white/70 text-sm">Est. Time</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Target className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {quizStats.averageOptions}
              </div>
              <div className="text-white/70 text-sm">Avg Options</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <Users className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {quizStats.completionRate}%
              </div>
              <div className="text-white/70 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Management */}
      <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Settings className="h-6 w-6 text-purple-400" />
            Question Management ({questions.length})
          </h2>
          <Button
            onClick={() => navigate(routes.QUESTION_CREATE(courseId, quizId))}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <Plus className="h-3 w-3 mr-2" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="h-20 w-20 text-white/20 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white/60 mb-3">
              No Questions Yet
            </h3>
            <p className="text-white/40 text-lg mb-6">
              Start building your quiz by adding questions
            </p>
            <Button
              onClick={() => navigate(routes.QUESTION_CREATE(courseId, quizId))}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-3 text-lg">
                        {question.text}
                      </h3>

                      {/* Answer Options */}
                      <div className="grid md:grid-cols-2 gap-2 mb-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex items-center gap-2 p-3 rounded-lg ${
                              question.answer === optionIndex + 1
                                ? "bg-green-500/20 border border-green-400/30"
                                : "bg-white/5 border border-white/10"
                            }`}
                          >
                            <span className="text-white/70 font-medium text-sm">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span className="text-white/90 text-sm">
                              {option}
                            </span>
                            {question.answer === optionIndex + 1 && (
                              <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      {question.explaination && (
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/20 mb-4">
                          <p className="text-blue-200 text-sm">
                            <strong>Explanation:</strong>{" "}
                            {question.explaination}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() =>
                        navigate(
                          routes.QUESTION_EDIT(courseId, quizId, question.id),
                        )
                      }
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30 p-2 rounded-lg transition-all duration-300"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteQuestionMutation(question.id)}
                      disabled={deletingQuestionId === question.id}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 p-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      {deletingQuestionId === question.id ? (
                        <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Status */}
      {questions.length > 0 && (
        <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            Quiz Status
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Quiz Ready</span>
            </div>
            <span className="text-white/60 text-sm">
              This quiz is ready for students with {questions.length} question
              {questions.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
