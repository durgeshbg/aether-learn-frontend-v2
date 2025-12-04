import type { Lesson } from "@/types/Lesson";
import { BookOpen, Play } from "lucide-react";
import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CourseLessonsProps {
  lessons?: Lesson[];
  lessonsCount: number;
  routeTo: (lessonId: string) => string;
}

const CourseLessons = ({
  lessons,
  lessonsCount,
  routeTo,
}: CourseLessonsProps) => {
  return (
    <Card className="h-fit">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Lessons ({lessonsCount})
          </CardTitle>
          <CardDescription>
            Browse the sequence for this course.
          </CardDescription>
        </div>
        <span className="rounded-full bg-primary/10 p-2 text-primary">
          <BookOpen className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {lessonsCount === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
            No lessons yet. Add your first lesson to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {lessons?.map((lesson, index) => (
              <Link
                key={lesson.id}
                to={routeTo(lesson.id)}
                className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  L{index + 1}
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-foreground">
                    {lesson.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Lesson • Click to view details
                  </span>
                </div>
                <Play className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseLessons;
