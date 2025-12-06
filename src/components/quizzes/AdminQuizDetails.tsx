import { deleteQuestion, getQuestions } from "@/services/question";
import { deleteQuiz, getQuiz } from "@/services/quiz";
import { questionKeys } from "@/tanstack/keys/question";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { routes } from "@/static-data/routes";
import {
  Brain,
  Edit3,
  Trash2,
  Plus,
  ArrowLeft,
  HelpCircle,
  CheckCircle,
  FileText,
  Clock,
  Info,
  Loader2Icon,
} from "lucide-react";
import { getDifficultyColor } from "@/utils/getDifficultyColor";

interface AdminQuizDetailsProps {
  courseId: string;
  quizId: string;
}

export const AdminQuizDetails = ({
  courseId,
  quizId,
}: AdminQuizDetailsProps) => {
  const navigate = useNavigate();

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data) => data.quiz,
  });

  const { data: questions } = useSuspenseQuery({
    queryKey: questionKeys.all(courseId, quizId),
    queryFn: async () => {
      return getQuestions(axiosInstance, { courseId, quizId });
    },
    select: (data) => data?.questions,
  });

  const handleEditQuiz = () => {
    navigate(routes.QUIZ_EDIT(courseId, quizId));
  };

  const { mutate: deleteQuizMutation, isPending: isDeleting } = useMutation({
    mutationKey: quizKeys.delete(courseId, quizId),
    mutationFn: async () => {
      return deleteQuiz(axiosInstance, { courseId, id: quizId });
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Quiz deleted successfully",
      invalidatesQueries: quizKeys.all(courseId),
    },
  });

  const { mutate: deleteQuestionMutation, isPending: isDeletingQuestion } =
    useMutation({
      mutationKey: questionKeys.delete(courseId, quizId, "delete"),
      mutationFn: async (questionId: string) => {
        return deleteQuestion(axiosInstance, {
          courseId,
          quizId,
          id: questionId,
        });
      },
      meta: {
        notify: true,
        successMessage: "Question deleted successfully",
        invalidatesQueries: questionKeys.all(courseId, quizId),
      },
    });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(routes.COURSE_DETAILS(courseId))}
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to course
      </Button>

      <Card>
        <CardHeader className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <div>
                <CardDescription>Quiz overview</CardDescription>
                <CardTitle className="text-3xl">{quiz.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {quiz.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 font-medium capitalize ${getDifficultyColor(
                    quiz.difficulty
                  )}`}
                >
                  {quiz.difficulty}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                  <Clock className="h-4 w-4" />
                  {quiz.durationMinutes} mins
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                  <HelpCircle className="h-4 w-4" />
                  {questions?.length || 0} questions
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                  <Info className="h-4 w-4" />
                  {quiz.maxAttempts} attempts
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleEditQuiz}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit quiz
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteQuizMutation()}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete quiz
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HelpCircle className="h-5 w-5 text-primary" />
              Quiz questions ({questions?.length || 0})
            </CardTitle>
            <CardDescription>
              Maintain and review the questions students will see.
            </CardDescription>
          </div>
          <Button
            onClick={() => navigate(routes.QUESTION_CREATE(courseId, quizId))}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add question
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions?.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-6 py-12 text-center">
              <HelpCircle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No questions yet. Start building this quiz by adding one.
              </p>
              <Button
                className="mt-4"
                onClick={() =>
                  navigate(routes.QUESTION_CREATE(courseId, quizId))
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Create first question
              </Button>
            </div>
          ) : (
            questions?.map((question, index) => (
              <div
                key={question.id}
                className="rounded-xl border border-border/70 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {question.text}
                    </h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = question.answer === optionIndex + 1;
                        return (
                          <div
                            key={optionIndex}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
                              isCorrect
                                ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                                : "border-border bg-muted/40 text-muted-foreground"
                            }`}
                          >
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span>{option}</span>
                            {isCorrect && (
                              <CheckCircle className="ml-auto h-4 w-4 text-emerald-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {question.explanation && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
                        <div className="mb-1 flex items-center gap-2 text-primary">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Explanation
                          </span>
                        </div>
                        {question.explanation}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            routes.QUESTION_EDIT(courseId, quizId, question.id)
                          )
                        }
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteQuestionMutation(question.id)}
                        disabled={isDeletingQuestion}
                      >
                        {isDeletingQuestion ? (
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
