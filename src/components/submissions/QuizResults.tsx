import { getQuizResults } from "@/services/quiz-result";
import { routes } from "@/static-data/routes";
import { quizResultKeys } from "@/tanstack/keys/quiz-result";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
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
    <div>
      <div>
        <h2>Quiz Submissions for {quizResults[0].quiz.title} </h2>
      </div>
      <div>
        {quizResults?.map((result) => (
          <div
            key={result.id}
            onClick={() => handleQuizResultClick(result.id)}
            className={`border p-4 mb-2 cursor-pointer ${
              result.passed ? "text-green-400" : "text-red-400"
            }`}
          >
            <p>Score: {result.score}</p>
            <p>Date: {new Date(result.createdAt).toLocaleDateString()}</p>
            <p>Result: {result.passed ? "Passed" : "Failed"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResults;
