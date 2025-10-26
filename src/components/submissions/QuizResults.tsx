import { getQuizResults } from "@/services/quiz-result";
import { routes } from "@/static-data/routes";
import { quizResultKeys } from "@/tanstack/keys/quiz-result";
import { axiosInstance } from "@/utils/axiosInstance";
import lastTimeAgo from "@/utils/lastTimeAgo";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const QuizResults = () => {
  const { courseId = "", quizId = "" } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();

  const { data: quizResults } = useSuspenseQuery({
    queryKey: quizResultKeys.all(courseId, quizId),
    queryFn: async () => {
      return getQuizResults(axiosInstance, {
        courseId,
        quizId,
      });
    },
    select: (data) => data.quizResults,
  });

  const handleQuizResultClick = (quizResultId: string) => {
    navigate(
      routes.COURSE_SUBMISSIONS_QUIZ_RESULT_DETAILS(
        courseId,
        quizId,
        quizResultId,
      ),
    );
  };

  return (
    <section className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
      {quizResults.length === 0 ? (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-white/30 mx-auto mb-3" />
          <p className="text-white/60">No quiz submissions available</p>
          <p className="text-white/40 text-sm">
            You have not attempted this quiz yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {quizResults?.map((result) => (
            <div
              key={result.id}
              onClick={() => handleQuizResultClick(result.id)}
              className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                    result.passed
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {result.passed ? "✓" : "✗"}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                    Score: {result.score}
                  </div>
                  <div className="text-white/60 text-xs">
                    {lastTimeAgo(result.createdAt)} • Click to view details
                  </div>
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    result.passed
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {result.passed ? "Pass" : "Fail"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default QuizResults;
