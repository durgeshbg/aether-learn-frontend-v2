import { getQuiz } from "@/services/quiz";
import { getQuizResultById } from "@/services/quiz-result";
import { quizResultKeys } from "@/tanstack/keys/quiz-result";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import QuestionAndOptions from "../quizzes/UserQuizComponents/QuestionAndOptions";
import { CheckCircle, FileText, FileX } from "lucide-react";

const QuizResultDetails = () => {
  const {
    courseId = "",
    quizId = "",
    quizResultId = "",
  } = useParams<{
    courseId: string;
    quizId: string;
    quizResultId: string;
  }>();

  const { data: quizResult } = useSuspenseQuery({
    queryKey: quizResultKeys.getById(courseId, quizId, quizResultId),
    queryFn: async () => {
      return getQuizResultById(axiosInstance, {
        courseId,
        quizId,
        id: quizResultId,
      });
    },
    select: (data) => data.quizResult,
  });

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data) => data?.quiz,
  });

  const getQuestionData = (response: string) => {
    const [questionId, optionIndex, result] = response.split(":");
    const question = quiz?.questions?.find((q) => q.id === questionId);
    return { question, optionIndex, isCorrect: result === "1" };
  };

  return (
    <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-6 text-white">
        <FileText className="h-5 w-5 text-purple-400" />
        Quiz Submission Details
      </h2>

      {quizResult ? (
        <div className="space-y-6">
          {/* Quiz Overview */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Quiz Title
                </div>
                <div className="text-white font-medium">
                  {quizResult.quiz.title}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Score
                </div>
                <div className="text-white font-medium">{quizResult.score}</div>
              </div>
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Submission Date
                </div>
                <div className="text-white font-medium">
                  {new Date(quizResult.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div>
                <div className="text-white/60 text-sm font-medium mb-1">
                  Submission Time
                </div>
                <div className="text-white font-medium">
                  {new Date(quizResult.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    quizResult.passed ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span
                  className={`font-medium ${
                    quizResult.passed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {quizResult.passed ? "Passed" : "Failed"}
                </span>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-white">
              <CheckCircle className="h-4 w-4 text-purple-400" />
              Question Responses
            </h3>

            <div className="space-y-4">
              {quizResult?.responses?.map((response, index) => {
                const { question, optionIndex, isCorrect } =
                  getQuestionData(response);

                return (
                  question &&
                  optionIndex && (
                    <QuestionAndOptions
                      key={index}
                      currentQuestion={question}
                      currentQuestionIndex={index}
                      answers={{
                        [question.id]: parseInt(optionIndex),
                      }}
                      isCorrect={isCorrect}
                      readOnly
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileX className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg font-medium">
            No submissions found
          </p>
          <p className="text-white/40 text-sm">
            This quiz has not been submitted yet
          </p>
        </div>
      )}
    </section>
  );
};

export default QuizResultDetails;
