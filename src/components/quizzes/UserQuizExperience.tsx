import { useState, useEffect, useCallback } from "react";
import { getQuestions } from "@/services/question";
import { getQuiz } from "@/services/quiz";
import { questionKeys } from "@/tanstack/keys/question";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import type { Question } from "@/types/Question";
import type { Quiz } from "@/types/Quiz";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import {
  Brain,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  FileText,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserQuizExperienceProps {
  courseId: string;
  quizId: string;
}

type QuizState = "preview" | "taking" | "completed" | "review";

export const UserQuizExperience = ({
  courseId,
  quizId,
}: UserQuizExperienceProps) => {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState>("preview");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data: { quiz: Quiz }) => data.quiz,
  });

  const { data: questions } = useSuspenseQuery({
    queryKey: questionKeys.all(courseId, quizId),
    queryFn: async () => {
      return getQuestions(axiosInstance, { courseId, quizId });
    },
    select: (data: { questions: Question[] }) => data?.questions || [],
  });

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
  }, [quizState, timeRemaining]);

  // Fullscreen and security features
  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Handle window focus/blur for security
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (quizState === "taking" && document.hidden) {
        setShowWarning(true);
        setWarningCount((prev) => prev + 1);
        if (warningCount >= 2) {
          handleSubmitQuiz(); // Auto-submit after 3 warnings
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizState === "taking") {
        // Prevent common cheating shortcuts
        if (
          (e.ctrlKey &&
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
  }, [quizState, warningCount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    setQuizState("taking");
    setCurrentQuestionIndex(0);
    setTimeRemaining(questions.length * 90); // 1.5 minutes per question
    enterFullscreen();
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex + 1,
    }));
  };

  const handleSubmitQuiz = () => {
    exitFullscreen();

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    setQuizScore(score);
    setQuizState("completed");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  // Warning Modal Component
  const WarningModal = () =>
    showWarning && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-2xl border border-red-400/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Security Warning
            </h3>
            <p className="text-white/80 mb-4">
              You switched away from the quiz. Warning {warningCount}/3.
              {warningCount >= 2 &&
                " Next violation will auto-submit your quiz."}
            </p>
            <Button
              onClick={() => setShowWarning(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
            >
              Continue Quiz
            </Button>
          </div>
        </div>
      </div>
    );

  // Preview State
  if (quizState === "preview") {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <Button
          onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Course
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/20 mx-auto mb-6">
              <Brain className="h-12 w-12 text-white/80" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{quiz.title}</h1>
            <p className="text-white/80 text-lg mb-8">{quiz.description}</p>

            {/* Quiz Info */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {questions.length}
                </div>
                <div className="text-white/70 text-sm">Questions</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">
                  {Math.ceil(questions.length * 1.5)} min
                </div>
                <div className="text-white/70 text-sm">Time Limit</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <Award className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">70%</div>
                <div className="text-white/70 text-sm">Pass Mark</div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-400/20 mb-8 text-left">
              <h3 className="flex items-center gap-2 text-yellow-400 font-semibold mb-3">
                <AlertTriangle className="h-5 w-5" />
                Quiz Instructions
              </h3>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>
                  • You have {Math.ceil(questions.length * 1.5)} minutes to
                  complete this quiz
                </li>
                <li>• Quiz will enter fullscreen mode for security</li>
                <li>• Switching tabs/windows will trigger warnings</li>
                <li>• 3 warnings will auto-submit your quiz</li>
                <li>• You can review your answers before submitting</li>
                <li>• Make sure you have a stable internet connection</li>
              </ul>
            </div>

            <Button
              onClick={handleStartQuiz}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Taking Quiz State
  if (quizState === "taking") {
    return (
      <>
        <WarningModal />
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Quiz Header */}
            <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">{quiz.title}</h1>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-white/70 text-sm">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <span className="text-white/70 text-sm">
                      Answered: {answeredQuestions}/{questions.length}
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

            {/* Question Card */}
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
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion.id, index)
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                      answers[currentQuestion.id] === index + 1
                        ? "bg-blue-500/20 border-blue-400 text-blue-300"
                        : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          answers[currentQuestion.id] === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white/20 text-white/70"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      {answers[currentQuestion.id] === index + 1 && (
                        <CheckCircle className="h-5 w-5 text-blue-400 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-3">
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(questions.length - 1, prev + 1),
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="mt-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-white font-medium mb-3">
                Question Navigator
              </h3>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      index === currentQuestionIndex
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
          </div>
        </div>
      </>
    );
  }

  // Completed State
  if (quizState === "completed") {
    const isPassed = quizScore !== null && quizScore >= 70;

    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl text-center">
          <div
            className={`w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
              isPassed
                ? "bg-green-500/20 border-green-400/30"
                : "bg-red-500/20 border-red-400/30"
            } border-2`}
          >
            {isPassed ? (
              <CheckCircle className="h-12 w-12 text-green-400" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-red-400" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Quiz {isPassed ? "Completed!" : "Completed"}
          </h1>

          <div className="mb-8">
            <div
              className={`text-6xl font-bold mb-2 ${
                isPassed ? "text-green-400" : "text-red-400"
              }`}
            >
              {quizScore}%
            </div>
            <p className="text-white/80">
              You got{" "}
              {
                Object.keys(answers).filter((questionId) =>
                  questions.find(
                    (q) =>
                      q.id === questionId && answers[questionId] === q.answer,
                  ),
                ).length
              }{" "}
              out of {questions.length} questions correct
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              Back to Course
            </Button>
            <Button
              onClick={() => setQuizState("review")}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl transition-all duration-300"
            >
              Review Answers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Review State
  if (quizState === "review") {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => setQuizState("completed")}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
          <div className="text-white">
            <span className="text-2xl font-bold">{quizScore}%</span>
            <span className="text-white/70 ml-2">Final Score</span>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.answer;

            return (
              <div
                key={question.id}
                className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                      isCorrect
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {question.text}
                    </h3>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border flex items-center gap-3 ${
                            question.answer === optionIndex + 1
                              ? "bg-green-500/20 border-green-400/30 text-green-400"
                              : userAnswer === optionIndex + 1 && !isCorrect
                                ? "bg-red-500/20 border-red-400/30 text-red-400"
                                : "bg-white/5 border-white/10 text-white/80"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              question.answer === optionIndex + 1
                                ? "bg-green-500 text-white"
                                : userAnswer === optionIndex + 1 && !isCorrect
                                  ? "bg-red-500 text-white"
                                  : "bg-white/20 text-white/70"
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <span className="text-sm">{option}</span>
                          {question.answer === optionIndex + 1 && (
                            <CheckCircle className="h-4 w-4 text-green-400 ml-auto" />
                          )}
                          {userAnswer === optionIndex + 1 && !isCorrect && (
                            <AlertTriangle className="h-4 w-4 text-red-400 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>

                    {question.explaination && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-400/20">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-400 text-sm font-medium">
                            Explanation
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">
                          {question.explaination}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl transition-all duration-300"
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
