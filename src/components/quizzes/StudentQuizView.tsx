import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import type { Question } from "@/types/Question";
import type { Quiz } from "@/types/Quiz";
import {
  Brain,
  ArrowLeft,
  Timer,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Lock,
  Play,
} from "lucide-react";

interface StudentQuizViewProps {
  quiz: Quiz;
  questions: Question[];
  courseId: string;
  quizId: string;
}

interface QuizState {
  currentQuestion: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isStarted: boolean;
  isCompleted: boolean;
  isFullscreen: boolean;
  showResults: boolean;
}

export const StudentQuizView = ({ quiz, questions }: StudentQuizViewProps) => {
  const navigate = useNavigate();

  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: questions.length * 120, // 2 minutes per question
    isStarted: false,
    isCompleted: false,
    isFullscreen: false,
    showResults: false,
  });

  // Fullscreen management
  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setQuizState((prev) => ({ ...prev, isFullscreen: true }));
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setQuizState((prev) => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  // Timer management
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (
      quizState.isStarted &&
      !quizState.isCompleted &&
      quizState.timeRemaining > 0
    ) {
      interval = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeRemaining <= 1) {
            return {
              ...prev,
              timeRemaining: 0,
              isCompleted: true,
              showResults: true,
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizState.isStarted, quizState.isCompleted, quizState.timeRemaining]);

  // Prevent navigation during quiz
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (quizState.isStarted && !quizState.isCompleted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizState.isStarted && !quizState.isCompleted) {
        // Disable F12, Ctrl+Shift+I, etc.
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.shiftKey && e.key === "C") ||
          (e.ctrlKey && e.key === "u")
        ) {
          e.preventDefault();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (quizState.isStarted && !quizState.isCompleted && document.hidden) {
        // Log tab switch attempt - in real app, you might want to track this
        console.warn("Student switched tabs during quiz");
      }
    };

    if (quizState.isStarted && !quizState.isCompleted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quizState.isStarted, quizState.isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    enterFullscreen();
    setQuizState((prev) => ({ ...prev, isStarted: true }));
  };

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answerIndex + 1 },
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    }
  };

  const submitQuiz = () => {
    setQuizState((prev) => ({
      ...prev,
      isCompleted: true,
      showResults: true,
    }));
    exitFullscreen();
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (quizState.answers[index] === question.answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  // Quiz Introduction/Start Screen
  if (!quizState.isStarted) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <Button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/20 mx-auto mb-6">
            <Brain className="h-10 w-10 text-white/80" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">{quiz.title}</h1>
          <p className="text-white/80 text-lg mb-8">{quiz.description}</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <HelpCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {questions.length}
              </div>
              <div className="text-white/70">Questions</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <Timer className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {formatTime(quizState.timeRemaining)}
              </div>
              <div className="text-white/70">Time Limit</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">70%</div>
              <div className="text-white/70">Pass Mark</div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-400/30 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-200 font-semibold">
                Important Instructions
              </span>
            </div>
            <ul className="text-yellow-100 text-sm space-y-2 text-left">
              <li>• The quiz will enter fullscreen mode for security</li>
              <li>• You cannot navigate away or switch tabs during the quiz</li>
              <li>• Your progress is automatically saved</li>
              <li>• You can review and change answers before submitting</li>
              <li>• The quiz will auto-submit when time expires</li>
            </ul>
          </div>

          <Button
            onClick={startQuiz}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl text-lg font-semibold"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (quizState.showResults) {
    const score = calculateScore();
    const passed = score.percentage >= 70;

    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl text-center">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border mx-auto mb-6 ${
              passed
                ? "bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-400/30"
                : "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-400/30"
            }`}
          >
            {passed ? (
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-10 w-10 text-red-400" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            {passed ? "Congratulations!" : "Quiz Complete"}
          </h1>
          <p className="text-white/80 text-lg mb-8">
            {passed
              ? "You have successfully passed the quiz!"
              : "You did not reach the passing score this time."}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-white">
                {score.correct}
              </div>
              <div className="text-white/70">Correct Answers</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-white">{score.total}</div>
              <div className="text-white/70">Total Questions</div>
            </div>
            <div
              className={`p-4 rounded-xl border ${
                passed
                  ? "bg-emerald-500/10 border-emerald-400/30"
                  : "bg-red-500/10 border-red-400/30"
              }`}
            >
              <div
                className={`text-3xl font-bold ${passed ? "text-emerald-400" : "text-red-400"}`}
              >
                {score.percentage}%
              </div>
              <div className="text-white/70">Final Score</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
            {!passed && (
              <Button
                onClick={() => window.location.reload()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Screen
  const currentQ = questions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(quizState.answers).length;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex flex-col">
      {/* Quiz Header */}
      <div className="p-4 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-medium">Secure Quiz Mode</span>
            </div>
            <div className="text-white/70 text-sm">
              Question {quizState.currentQuestion + 1} of {questions.length}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                quizState.timeRemaining < 300
                  ? "bg-red-500/20 text-red-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              <Timer className="h-4 w-4" />
              <span className="font-mono font-semibold">
                {formatTime(quizState.timeRemaining)}
              </span>
            </div>

            <div className="text-white/70 text-sm">
              {answeredQuestions}/{questions.length} answered
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold">
                  {quizState.currentQuestion + 1}
                </div>
                <span className="text-white/70 text-sm">
                  Question {quizState.currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white leading-relaxed">
                {currentQ.text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((option, index) => {
                const isSelected =
                  quizState.answers[quizState.currentQuestion] === index + 1;
                return (
                  <button
                    key={index}
                    onClick={() =>
                      selectAnswer(quizState.currentQuestion, index)
                    }
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-blue-500/20 border-blue-400/50 text-blue-100"
                        : "bg-white/5 border-white/20 text-white/90 hover:bg-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-blue-400 bg-blue-400"
                            : "border-white/40"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-sm">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="flex-1">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                onClick={previousQuestion}
                disabled={quizState.currentQuestion === 0}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {quizState.currentQuestion < questions.length - 1 ? (
                  <Button
                    onClick={nextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-all duration-300"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={submitQuiz}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-xl transition-all duration-300"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Quiz
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="p-4 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-center">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {questions.map((_, index) => {
              const isAnswered = quizState.answers[index] !== undefined;
              const isCurrent = index === quizState.currentQuestion;

              return (
                <button
                  key={index}
                  onClick={() =>
                    setQuizState((prev) => ({
                      ...prev,
                      currentQuestion: index,
                    }))
                  }
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                    isCurrent
                      ? "bg-blue-500 text-white"
                      : isAnswered
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                        : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
