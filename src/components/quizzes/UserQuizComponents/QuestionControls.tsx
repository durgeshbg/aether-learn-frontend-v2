import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface IQuestionControls {
  currentIndex: number;
  questionLength: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  handleSubmitQuiz: () => void;
  isSubmitting: boolean;
}

const QuestionControls = ({
  currentIndex,
  setCurrentIndex,
  questionLength,
  handleSubmitQuiz,
  isSubmitting,
}: IQuestionControls) => {
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(questionLength - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      <div className="flex gap-3">
        {currentIndex === questionLength - 1 ? (
          <Button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionControls;
