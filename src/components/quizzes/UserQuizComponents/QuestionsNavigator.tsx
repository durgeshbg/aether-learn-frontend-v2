import type { Question } from "@/types/Question";
import type { Dispatch, SetStateAction } from "react";

interface AnswersMap {
  [questionId: string]: number;
}

import { cn } from "@/lib/utils";

interface IQuestionsNavigator {
  questions: Question[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  answers: AnswersMap;
  className?: string;
}

const QuestionsNavigator = ({
  questions,
  currentIndex,
  setCurrentIndex,
  answers,
  className,
}: IQuestionsNavigator) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card p-4",
        className
      )}
    >
      <h3 className="mb-3 text-sm font-medium text-foreground">
        Question navigator
      </h3>
      <div className="grid grid-cols-6 gap-2 text-sm">
        {questions.map((_, index) => {
          const answered = Boolean(answers[questions[index].id]);
          const isCurrent = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-8 w-8 rounded-md font-semibold transition-colors cursor-pointer ${
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : answered
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionsNavigator;
