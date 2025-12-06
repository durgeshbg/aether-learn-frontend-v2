import { getQuiz } from "@/services/quiz";
import { getQuizResultById } from "@/services/quiz-result";
import { quizResultKeys } from "@/tanstack/keys/quiz-result";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import QuestionAndOptions from "../quizzes/UserQuizComponents/QuestionAndOptions";
import { FileX, Award, ShieldCheck, CalendarDays, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const QuizResultDetails = () => {
  const {
    courseId = "",
    quizId = "",
    quizResultId = "",
  } = useParams<{
    courseId: string;
    quizId: string;
    quizResultId: string;
  }>();

  const { data: quizResult } = useSuspenseQuery({
    queryKey: quizResultKeys.getById(courseId, quizId, quizResultId),
    queryFn: async () => {
      return getQuizResultById(axiosInstance, {
        courseId,
        quizId,
        id: quizResultId,
      });
    },
    select: (data) => data.quizResult,
  });

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data) => data?.quiz,
  });

  const getQuestionData = (response: string) => {
    const [questionId, optionIndex, result] = response.split(":");
    const question = quiz?.questions?.find((q) => q.id === questionId);
    return { question, optionIndex, isCorrect: result === "1" };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardDescription>Quiz submission</CardDescription>
            <CardTitle className="text-3xl">
              {quizResult ? quizResult.quiz.title : "Submission details"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {quizResult ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Score",
                  value: quizResult.score,
                  icon: Award,
                },
                {
                  label: "Status",
                  value: quizResult.passed ? "Passed" : "Failed",
                  icon: ShieldCheck,
                },
                {
                  label: "Date",
                  value: new Date(quizResult.createdAt).toLocaleDateString(),
                  icon: CalendarDays,
                },
                {
                  label: "Time",
                  value: new Date(quizResult.createdAt).toLocaleTimeString(),
                  icon: Clock,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2"
                >
                  <span className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
              <FileX className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No submission found for this quiz.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {quizResult && (
        <div className="space-y-4">
          {quizResult?.responses?.map((response, index) => {
            const { question, optionIndex, isCorrect } =
              getQuestionData(response);

            return (
              question &&
              optionIndex && (
                <QuestionAndOptions
                  key={index}
                  currentQuestion={question}
                  currentQuestionIndex={index}
                  answers={{
                    [question.id]: parseInt(optionIndex),
                  }}
                  isCorrect={isCorrect}
                  readOnly
                />
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizResultDetails;
