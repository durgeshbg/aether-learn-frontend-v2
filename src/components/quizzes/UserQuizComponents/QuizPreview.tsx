import type { Quiz } from "@/types/Quiz";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  Brain,
  Clock,
  FileText,
} from "lucide-react";
import { routes } from "@/static-data/routes";
import { useNavigate } from "react-router";
import { QuizPreviewData } from "../constants";

interface IQuizPreview {
  courseId: string;
  quiz: Quiz;
  handleStartQuiz: () => void;
}

const QuizPreview = ({ courseId, quiz, handleStartQuiz }: IQuizPreview) => {
  const navigate = useNavigate();
  const questionsLength = quiz?.questions?.length || 0;
  const { rules } = QuizPreviewData;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
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
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Brain className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl">{quiz.title}</CardTitle>
          <CardDescription className="text-base">
            {quiz.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Questions",
                value: questionsLength,
                icon: FileText,
              },
              {
                label: "Time limit",
                value: `${quiz.durationMinutes} min`,
                icon: Clock,
              },
              {
                label: "Pass mark",
                value: `${quiz.passPercentage}%`,
                icon: Award,
              },
              {
                label: "Attempts",
                value: quiz.maxAttempts,
                icon: AlertTriangle,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2"
              >
                <span className="rounded-full bg-muted p-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border/70 bg-muted/40 p-4 text-left">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              Quiz instructions
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {rules.map((rule, index) => (
                <li key={index}>• {rule}</li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button size="lg" onClick={handleStartQuiz}>
              Start quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPreview;
