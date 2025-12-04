import type { Quiz } from "@/types/Quiz";
import { Brain, Target } from "lucide-react";
import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CourseQuizzesProps {
  quizzesCount: number;
  quizzes?: Quiz[];
  routeTo: (quizId: string) => string;
}

const CourseQuizzes = ({
  quizzesCount,
  quizzes,
  routeTo,
}: CourseQuizzesProps) => {
  return (
    <Card className="h-fit">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Quizzes ({quizzesCount})
          </CardTitle>
          <CardDescription>
            Assessment checkpoints to validate learning.
          </CardDescription>
        </div>
        <span className="rounded-full bg-primary/10 p-2 text-primary">
          <Brain className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {quizzesCount === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
            No quizzes yet. Add quizzes to test knowledge.
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes?.map((quiz, index) => (
              <Link
                key={quiz.id}
                to={routeTo(quiz.id)}
                className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  Q{index + 1}
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-foreground">
                    {quiz.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Quiz • Click to view details
                  </span>
                </div>
                <Target className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseQuizzes;
