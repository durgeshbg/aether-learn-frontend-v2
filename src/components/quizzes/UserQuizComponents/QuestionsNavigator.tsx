import type { Question } from "@/types/Question";
import type { Dispatch, SetStateAction } from "react";

interface AnswersMap {
  [questionId: string]: number;
}

interface IQuestionsNavigator {
  questions: Question[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  answers: AnswersMap;
}

const QuestionsNavigator = ({
  questions,
  currentIndex,
  setCurrentIndex,
  answers,
}: IQuestionsNavigator) => {
  return (
    <div className="mt-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
      <h3 className="text-white font-medium mb-3">Question Navigator</h3>
      <div className="grid grid-cols-10 gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all duration-300 ${
              index === currentIndex
                ? "bg-blue-500 text-white"
                : answers[questions[index].id]
                  ? "bg-green-500/30 text-green-400 border border-green-400/50"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionsNavigator;
