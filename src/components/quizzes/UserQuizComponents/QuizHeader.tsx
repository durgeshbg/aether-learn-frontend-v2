import { Clock, Lock, Unlock } from "lucide-react";
import { formatTime } from "../helper";

interface IQuizHeader {
  title: string;
  currentQuestionIndex: number;
  questionsLength: number;
  answersLength: number;
  isFullscreen: boolean;
  timeRemaining: number;
}

const QuizHeader = ({
  title,
  currentQuestionIndex,
  questionsLength,
  answersLength = 0,
  isFullscreen,
  timeRemaining,
}: IQuizHeader) => {
  const progress = ((currentQuestionIndex + 1) / questionsLength) * 100;

  return (
    <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-white/70 text-sm">
              Question {currentQuestionIndex + 1} of {questionsLength}
            </span>
            <span className="text-white/70 text-sm">
              Answered: {answersLength}/{questionsLength}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-yellow-400" />
            <span className="font-mono text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFullscreen ? (
              <Lock className="h-5 w-5 text-green-400" />
            ) : (
              <Unlock className="h-5 w-5 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;
