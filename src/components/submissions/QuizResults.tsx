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
        quizResultId
      )
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quiz attempts</h3>
          <p className="text-sm text-muted-foreground">
            {quizResults.length} submissions found.
          </p>
        </div>
      </div>
      {quizResults.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
          <Target className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No quiz submissions available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quizResults?.map((result) => (
            <button
              key={result.id}
              onClick={() => handleQuizResultClick(result.id)}
              className="flex w-full items-center gap-4 rounded-lg border border-border/70 px-4 py-3 text-left transition-colors hover:border-primary/40"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  result.passed
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {result.passed ? "✓" : "✗"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Score: {result.score}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lastTimeAgo(result.createdAt)} • Tap to view details
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default QuizResults;
