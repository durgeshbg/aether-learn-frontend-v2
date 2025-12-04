import { deleteCourse, getCourseById } from "@/services/course";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { BookOpen, ArrowLeft, Settings } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { useAuth } from "@/hooks/useAuth";
import { enrollUserInCourse } from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { FeedbackDialog } from "./FeedbackDialog";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import { COURSE_ACTIONS } from "./constants";
import CourseLessons from "./Sections/CourseLessons";
import CourseQuizzes from "./Sections/CourseQuizzes";
import CourseAssesments from "./Sections/CourseAssessments";

const CourseDetails = () => {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: course } = useSuspenseQuery({
    queryKey: courseKeys.getById(courseId),
    queryFn: async () => {
      return getCourseById(axiosInstance, { id: courseId });
    },
    select: (data) => data.course,
  });

  const { mutate: deleteCourseMutation } = useMutation({
    mutationKey: courseKeys.delete(courseId),
    mutationFn: async () => {
      return deleteCourse(axiosInstance, { id: courseId });
    },
    onSuccess: () => {
      navigate(routes.COURSES);
    },
    meta: {
      notify: true,
      successMessage: "Course deleted successfully",
      invalidatesQueries: courseKeys.all(),
    },
  });

  const { mutate: enrollCourseMutation, isPending: isUpdatingEnrollment } =
    useMutation({
      mutationKey: userKeys.enrollCourse(),
      mutationFn: async () => {
        return enrollUserInCourse(axiosInstance, {
          courseId,
          enroll: !course.enrolled,
        });
      },
      meta: {
        notify: true,
        successMessage: `${
          course.enrolled ? "Unenrolled" : "Enrolled"
        } in course successfully!`,
        invalidatesQueries: [courseKeys.all()],
      },
    });

  const handleAction = (url?: string) => {
    if (url) {
      navigate(url);
    } else {
      deleteCourseMutation();
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <header className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={() => navigate(routes.COURSES)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to courses
          </Button>
          <Button
            onClick={() => enrollCourseMutation()}
            variant={course.enrolled ? "destructive" : "default"}
            disabled={isUpdatingEnrollment}
          >
            {course.enrolled ? "Unenroll" : "Enroll"}
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wide">
                Course
              </div>
              <div className="space-y-3">
                <CardTitle className="text-3xl font-semibold tracking-tight">
                  {course.name}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {course.description}
                </CardDescription>
              </div>
              <div
                className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium ${getDifficultyColor(
                  course.difficulty
                )}`}
              >
                {course.difficulty}
              </div>
              {!course?.feedbackSubmitted && (
                <FeedbackDialog courseId={courseId} />
              )}
            </div>
            <div className="flex w-full max-w-[160px] items-center justify-center rounded-xl border border-border/60 bg-muted/40 p-4 sm:w-auto">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        {user?.role === "ADMIN" && (
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Course management
                </CardTitle>
                <CardDescription>
                  Adjust content, lessons, and assignments.
                </CardDescription>
              </div>
              <span className="rounded-full bg-primary/10 p-2 text-primary">
                <Settings className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {COURSE_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  onClick={() =>
                    handleAction(action.url ? action.url(courseId) : undefined)
                  }
                  className="justify-start"
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <CourseLessons
          lessons={course.lessons}
          lessonsCount={course.lessonsCount}
          routeTo={(lessonId: string) =>
            routes.LESSON_DETAILS(courseId, lessonId)
          }
        />
        <CourseQuizzes
          quizzes={course.quizzes}
          quizzesCount={course.quizzesCount}
          routeTo={(quizId: string) => routes.QUIZ_DETAILS(courseId, quizId)}
        />
        <CourseAssesments
          codeAssessmentsCount={course.codeAssessmentsCount}
          codeAssessments={course.codeAssessments}
          routeTo={(assessmentId: string) =>
            routes.CODE_ASSESSMENT_DETAILS(courseId, assessmentId)
          }
        />
      </div>
    </div>
  );
};

export default CourseDetails;
