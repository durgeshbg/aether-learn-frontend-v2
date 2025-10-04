import { AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../ui/button";
import { routes } from "@/static-data/routes";

const QuizCompleted = ({
  courseId,
  quizId,
  submissionError,
}: {
  courseId: string;
  quizId: string;
  submissionError: string | null;
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl text-center">
        <div
          className={`w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center ${!submissionError ? "bg-blue-500/20 border-blue-400" : "bg-red-500/20 border-red-400"} border-2`}
        >
          {!submissionError ? (
            <CheckCircle className="h-12 w-12 text-blue-400" />
          ) : (
            <AlertCircle className="h-12 w-12 text-red-400" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          {!submissionError ? "Quiz Completed!" : "Submission Error"}
        </h1>

        <div className="mb-8">
          <p className="text-white/80 text-lg">
            {!submissionError
              ? "You have successfully completed the quiz."
              : submissionError}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
            className={`${!submissionError ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-400"} text-white px-6 py-3 rounded-xl transition-all duration-300`}
          >
            Back to Course
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate(routes.COURSE_SUBMISSIONS_QUIZ_DETAILS(courseId, quizId))
            }
            className="text-white px-6 py-3 rounded-xl border-white/30 hover:border-white transition-all duration-300"
          >
            View Previous Submissions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizCompleted;
