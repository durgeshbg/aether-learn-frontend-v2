import type { Quiz } from "@/types/Quiz";
import { Button } from "../../ui/button";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Brain,
  Clock,
  FileText,
} from "lucide-react";
import { routes } from "@/static-data/routes";
import { useNavigate } from "react-router";
import { QuizPreviewData } from "../constants";

interface IQuizPreview {
  courseId: string;
  quiz: Quiz;
  handleStartQuiz: () => void;
}

const QuizPreview = ({ courseId, quiz, handleStartQuiz }: IQuizPreview) => {
  const navigate = useNavigate();
  const questionsLength = quiz?.questions?.length || 0;
  const { rules } = QuizPreviewData;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <Button
        onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
        className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Course
      </Button>

      <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
        <div className="text-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/20 mx-auto mb-6">
            <Brain className="h-12 w-12 text-white/80" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">{quiz.title}</h1>
          <p className="text-white/80 text-lg mb-8">{quiz.description}</p>

          {/* Quiz Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {questionsLength}
              </div>
              <div className="text-white/70 text-sm">Questions</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {quiz.durationMinutes} min
              </div>
              <div className="text-white/70 text-sm">Time Limit</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Award className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {quiz.passPercentage}%
              </div>
              <div className="text-white/70 text-sm">Pass Mark</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-400/20 mb-8 text-left">
            <h3 className="flex items-center gap-2 text-yellow-400 font-semibold mb-3">
              <AlertTriangle className="h-5 w-5" />
              Quiz Instructions
            </h3>
            <ul className="space-y-2 text-white/80 text-sm">
              {rules.map((rule, index) => (
                <li key={index}>• {rule}</li>
              ))}
            </ul>
          </div>

          <Button
            onClick={handleStartQuiz}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;
