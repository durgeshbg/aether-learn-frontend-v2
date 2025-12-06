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
        variant="outline"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      {currentIndex === questionLength - 1 ? (
        <Button onClick={handleSubmitQuiz} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit quiz"}
        </Button>
      ) : (
        <Button variant="outline" onClick={handleNext}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default QuestionControls;
