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
    <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-6">
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg flex-shrink-0">
            {currentQuestionIndex + 1}
          </div>
          <h2 className="text-xl font-semibold text-white leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = answers[currentQuestion.id] === index + 1;
          return (
            <button
              key={index}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? palleteArray[0]
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
              }`}
              disabled={readOnly || !handleAnswerSelect}
              onClick={() => handleAnswerSelect?.(currentQuestion.id, option)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isSelected ? palleteArray[1] : "bg-white/20 text-white/70"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
                {isSelected && <CheckCircle className={palleteArray[2]} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionAndOptions;
