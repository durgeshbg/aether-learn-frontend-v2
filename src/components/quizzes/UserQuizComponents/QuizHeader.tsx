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
    <div className="mb-6 rounded-xl border border-border/70 bg-card px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Question {currentQuestionIndex + 1} of {questionsLength}
            </span>
            <span>
              Answered {answersLength}/{questionsLength}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-base">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isFullscreen ? (
              <Lock className="h-4 w-4 text-emerald-500" />
            ) : (
              <Unlock className="h-4 w-4 text-destructive" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuizHeader;
