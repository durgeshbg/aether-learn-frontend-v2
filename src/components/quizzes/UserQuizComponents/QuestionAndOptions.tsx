import type { Question } from "@/types/Question";
import { CheckCircle } from "lucide-react";
import { getPallete } from "../helper";

interface IQuestionAndOptions {
  currentQuestion: Question;
  currentQuestionIndex: number;
  answers: { [questionId: string]: number };
  handleAnswerSelect?: (questionId: string, selectedOption: string) => void;
  isCorrect?: boolean;
  readOnly?: boolean;
}

const QuestionAndOptions = ({
  currentQuestion,
  currentQuestionIndex,
  answers,
  handleAnswerSelect,
  readOnly = false,
  isCorrect,
}: IQuestionAndOptions) => {
  const palleteArray = getPallete(readOnly, isCorrect);
  return (
    <div className="mb-6 rounded-xl border border-border/70 bg-card p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
          {currentQuestionIndex + 1}
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {currentQuestion.text}
        </h2>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = answers[currentQuestion.id] === index + 1;
          return (
            <button
              key={index}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                isSelected
                  ? palleteArray[0]
                  : "border-border/70 bg-muted/40 text-muted-foreground hover:border-border"
              }`}
              disabled={readOnly || !handleAnswerSelect}
              onClick={() => handleAnswerSelect?.(currentQuestion.id, option)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isSelected
                      ? palleteArray[1]
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-foreground">{option}</span>
                {isSelected && (
                  <CheckCircle className={`${palleteArray[2]} ml-auto`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionAndOptions;
