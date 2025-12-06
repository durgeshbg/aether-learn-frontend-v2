import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getLessonById, deleteLesson } from "@/services/lesson";
import { routes } from "@/static-data/routes";
import { lessonKeys } from "@/tanstack/keys/lessonKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { getDifficultyColor } from "@/utils/getDifficultyColor";
import { getLessonStats } from "./helper";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Edit3,
  Eye,
  FileText,
  Layers,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react";

const LessonDetails = () => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: lesson } = useSuspenseQuery({
    queryKey: lessonKeys.getById(courseId, lessonId),
    queryFn: async () => {
      return getLessonById(axiosInstance, { courseId, id: lessonId });
    },
    select: (data) => data.lesson,
  });

  const handleEditLesson = () => {
    navigate(routes.LESSON_EDIT(courseId, lessonId));
  };

  const { mutate: deleteLessonMutation, isPending: isDeleting } = useMutation({
    mutationKey: lessonKeys.delete(courseId, lessonId),
    mutationFn: async () => {
      return deleteLesson(axiosInstance, { courseId, id: lessonId });
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Lesson deleted successfully",
      invalidatesQueries: lessonKeys.all(courseId),
    },
  });

  const stats = useMemo(() => getLessonStats(lesson), [lesson]);

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
        <CardHeader className="flex flex-col gap-6 border-b pb-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PlayCircle className="h-6 w-6" />
              </div>
            <div className="space-y-3">
              <div>
                <CardDescription>Lesson overview</CardDescription>
                <CardTitle className="text-3xl">{lesson.title}</CardTitle>
              </div>
                  <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${getDifficultyColor(lesson.difficulty)}`}
                  >
                    {lesson.difficulty}
                </div>
              </div>
            </div>

            {user?.role === "ADMIN" && (
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleEditLesson}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit lesson
                </Button>
                <Button
                variant="destructive"
                  onClick={() => deleteLessonMutation()}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete lesson
                    </>
                  )}
                </Button>
              </div>
            )}
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Modules",
              value: stats.totalModules,
              icon: Layers,
            },
            {
              label: "Estimated duration",
              value: stats.estimatedDuration,
              icon: Clock,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3"
            >
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold text-foreground">
                  {value}
                </p>
              </div>
              <span className="rounded-full bg-muted p-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Lesson content</CardTitle>
            <CardDescription>
              Provide context and objectives for learners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border border-border/60 bg-card/80 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {lesson.content}
              </p>
            </div>

            {!!lesson.objectives?.length && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Learning objectives
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {lesson.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{objective}</span>
                    </li>
                ))}
              </ul>
            </div>
          )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">
              Modules ({stats.totalModules})
              </CardTitle>
              <CardDescription>
                Review ordered modules within this lesson.
              </CardDescription>
            </div>
            {user?.role === "ADMIN" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  navigate(routes.MODULE_CREATE(courseId, lessonId))
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add module
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {lesson.modules?.length ? (
              lesson.modules.map((module, index) => (
                <Link
                  key={module.id}
                  to={routes.MODULE_DETAILS(courseId, lessonId, module.id)}
                  className="flex items-center gap-4 rounded-lg border border-border/70 px-4 py-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                    <p className="font-medium text-foreground">{module.title}</p>
                    <p className="text-sm text-muted-foreground">
                        Module • Click to view details
                    </p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
                <Layers className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No modules yet. Start adding content to this lesson.
                </p>
                {user?.role === "ADMIN" && (
                  <div className="mt-4">
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(routes.MODULE_CREATE(courseId, lessonId))
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create first module
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonDetails;

