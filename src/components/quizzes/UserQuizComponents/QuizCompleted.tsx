import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../ui/button";
import { routes } from "@/static-data/routes";

const QuizCompleted = ({ courseId }: { courseId: string }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl text-center">
        <div className="w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-blue-500/20 border-blue-400/30 border-2">
          <CheckCircle className="h-12 w-12 text-blue-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h1>

        <div className="mb-8">
          <p className="text-white/80 text-lg">
            You have successfully completed the quiz.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Back to Course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizCompleted;
