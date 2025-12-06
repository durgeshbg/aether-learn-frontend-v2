import { AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { routes } from "@/static-data/routes";

const QuizCompleted = ({
  courseId,
  quizId,
  submissionError,
}: {
  courseId: string;
  quizId: string;
  submissionError: string | null;
}) => {
  const navigate = useNavigate();
  const isSuccess = !submissionError;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isSuccess ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="h-8 w-8" />
            ) : (
              <AlertCircle className="h-8 w-8" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isSuccess ? "Quiz completed" : "Submission error"}
          </CardTitle>
          <CardDescription>
            {isSuccess
              ? "You have successfully completed the quiz."
              : submissionError}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          {
            "You can review your answers in submissions or return to the course overview."
          }
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate(routes.COURSE_DETAILS(courseId))}>
            Back to course
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate(routes.COURSE_SUBMISSIONS_QUIZ_DETAILS(courseId, quizId))
            }
          >
            View submissions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizCompleted;
