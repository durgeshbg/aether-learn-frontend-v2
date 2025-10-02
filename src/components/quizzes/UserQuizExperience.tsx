import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type SetStateAction,
  type Dispatch,
} from "react";
import { getQuiz } from "@/services/quiz";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { quizResultKeys } from "@/tanstack/keys/quiz-result";
import type { QuizResultCreateType } from "@/types/QuizResult";
import { createQuizResult } from "@/services/quiz-result";
import QuizPreview from "./UserQuizComponents/QuizPreview";
import { shuffleArray } from "./helper";
import type { Question } from "@/types/Question";
import QuizCompleted from "./UserQuizComponents/QuizCompleted";
import WarningScreen from "./UserQuizComponents/WraningScreen";
import QuestionsNavigator from "./UserQuizComponents/QuestionsNavigator";
import QuestionControls from "./UserQuizComponents/QuestionControls";
import QuestionAndOptions from "./UserQuizComponents/QuestionAndOptions";
import QuizHeader from "./UserQuizComponents/QuizHeader";
import useFullscreen from "@/hooks/useFullScreen";
import { MAX_WARNING_COUNT } from "./constants";
import { useOutletContext } from "react-router";

interface UserQuizExperienceProps {
  courseId: string;
  quizId: string;
}

interface AnswersMap {
  [questionId: string]: number;
}

type QuizState = "preview" | "taking" | "completed";

export const UserQuizExperience = ({
  courseId,
  quizId,
}: UserQuizExperienceProps) => {
  const [quizState, setQuizState] = useState<QuizState>("preview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();
  const [showWarning, setShowWarning] = useState(false);
  const [setHideNavbar] =
    useOutletContext<[Dispatch<SetStateAction<boolean>>]>();

  const warningCountRef = useRef(0);
  const prevFullscreenRef = useRef(isFullscreen);

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data) => data.quiz,
  });

  const { mutate: submitQuiz, isPending: isSubmitingQuiz } = useMutation({
    mutationKey: quizResultKeys.create(courseId, quizId),
    mutationFn: async (quizResult: QuizResultCreateType) => {
      return createQuizResult(axiosInstance, { quizId, courseId }, quizResult);
    },
    meta: {
      notify: true,
      successMessage: "Quiz submitted successfully!",
      errorMessage: "Failed to submit quiz. Please try again.",
    },
    onSuccess: () => {
      setQuizState("completed");
    },
  });

  const questions = useMemo(
    () => shuffleArray<Question>(quiz?.questions || []),
    [quiz?.questions],
  );

  const handleSubmitQuiz = useCallback(() => {
    if (isSubmitingQuiz) return; // Prevent multiple submissions
    if (!answers || !quiz) return;
    const answersArray = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));
    submitQuiz({
      answers: answersArray,
    });
    setHideNavbar(false);
    exitFullscreen();
    setQuizState("completed");
    setShowWarning(false);
    warningCountRef.current = 0;
  }, [
    answers,
    quiz,
    exitFullscreen,
    isSubmitingQuiz,
    submitQuiz,
    setHideNavbar,
  ]);

  const handleStartQuiz = () => {
    setQuizState("taking");
    setCurrentQuestionIndex(0);
    setTimeRemaining((quiz?.durationMinutes || 1) * 60); // 1.5 minutes per question
    setHideNavbar(true);
    enterFullscreen();
  };

  // Submit quiz when user refreshes page while quiz in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizState === "taking") {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
        handleSubmitQuiz();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quizState, handleSubmitQuiz]);

  // Timer effect
  useEffect(() => {
    if (quizState === "taking" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeRemaining, handleSubmitQuiz]);

  // Handle fullscreen exit detection - this is where the magic happens
  useEffect(() => {
    if (quizState === "taking" && prevFullscreenRef.current && !isFullscreen) {
      // User exited fullscreen during quiz
      setShowWarning(true);
      warningCountRef.current += 1;

      if (warningCountRef.current >= MAX_WARNING_COUNT) {
        handleSubmitQuiz(); // Auto-submit after 3 warnings
      }
    }

    prevFullscreenRef.current = isFullscreen;
  }, [quizState, isFullscreen, handleSubmitQuiz]);

  // Handle window focus/blur for security
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (quizState === "taking" && document.hidden) {
        setShowWarning(true);
        warningCountRef.current += 1;
        enterFullscreen();
        if (warningCountRef.current >= MAX_WARNING_COUNT) {
          handleSubmitQuiz(); // Auto-submit after 3 warnings
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizState === "taking") {
        // Prevent common cheating shortcuts
        if (
          ((e.ctrlKey || e.metaKey) &&
            (e.key === "c" ||
              e.key === "v" ||
              e.key === "a" ||
              e.key === "f")) ||
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I")
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [quizState, handleSubmitQuiz, enterFullscreen]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    const questionIndex = questions.findIndex((q) => q.id === questionId);
    if (questionIndex === -1) return;

    const answerIndex = questions[questionIndex].options.findIndex(
      (option) => option === answer,
    );
    if (answerIndex === -1) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex + 1, // Store 1-based index
    }));
  };

  if (quizState === "preview") {
    return (
      <QuizPreview
        courseId={courseId}
        quiz={quiz}
        handleStartQuiz={handleStartQuiz}
      />
    );
  }

  if (quizState === "taking") {
    return (
      <>
        {showWarning && (
          <WarningScreen
            warningCount={warningCountRef.current}
            setShowWarning={setShowWarning}
          />
        )}
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4">
          <div className="max-w-4xl mx-auto">
            <QuizHeader
              title={quiz.title}
              answersLength={answers?.length}
              currentQuestionIndex={currentQuestionIndex}
              questionsLength={questions.length}
              isFullscreen={isFullscreen}
              timeRemaining={timeRemaining}
            />

            <QuestionAndOptions
              currentQuestion={questions[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              handleAnswerSelect={handleAnswerSelect}
            />

            <QuestionControls
              currentIndex={currentQuestionIndex}
              setCurrentIndex={setCurrentQuestionIndex}
              questionLength={questions.length}
              handleSubmitQuiz={handleSubmitQuiz}
              isSubmitting={isSubmitingQuiz}
            />

            <QuestionsNavigator
              currentIndex={currentQuestionIndex}
              setCurrentIndex={setCurrentQuestionIndex}
              questions={questions}
              answers={answers}
            />
          </div>
        </div>
      </>
    );
  }

  if (quizState === "completed") {
    return <QuizCompleted courseId={courseId} />;
  }

  return null;
};
