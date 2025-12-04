import { BookOpen, Code, Play, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "@/types/Course";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import type { CourseProgress } from "@/types/User";

interface ICourseItem {
  course: Course;
  courseProgress?: CourseProgress;
  onCourseClick: (courseId: string) => void;
}

const CourseItem = ({ course, courseProgress, onCourseClick }: ICourseItem) => {
  // Is course created within the last 30 days
  const isCourseNew =
    new Date(course.createdAt) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && !course.enrolled;

  return (
    <Card
      key={course.id}
      className="flex h-full flex-col border border-border/60"
    >
      <CardHeader className="gap-4 pb-0">
        <div className="relative w-full overflow-hidden rounded-lg border bg-muted/30">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.name}
              className="h-40 w-full object-cover"
            />
          ) : (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              <BookOpen className="h-10 w-10" />
            </div>
          )}
          <div className="absolute inset-x-0 top-0 flex justify-between p-3 text-xs font-medium">
            {isCourseNew && (
              <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5">
                New
              </span>
            )}
            <span
              className={`ml-auto rounded-full px-2 py-0.5 uppercase ${getDifficultyColor(
                course.difficulty
              )}`}
            >
              {course.difficulty}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-lg">{course.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {course.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            <span>Progress</span>
            <span className="text-foreground">
              {courseProgress?.completionRate || 0}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${courseProgress?.completionRate || 0}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{course.lessonsCount} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{course.quizzesCount} quizzes</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span>{course.codeAssessmentsCount} assessments</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{course.rating ?? "N/A"} rating</span>
          </div>
        </div>

        <div className="rounded-full border border-dashed px-3 py-1 text-xs text-muted-foreground">
          {courseProgress?.nextModuleId ? (
            <>
              Next:{" "}
              <span className="font-medium text-foreground">
                {courseProgress.nextModule?.title}
              </span>
            </>
          ) : (
            "Not started"
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={() => onCourseClick(course.id)}>
          <Play className="mr-2 h-4 w-4" />
          {course.enrolled ? "Continue learning" : "Start course"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseItem;
