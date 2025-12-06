import { deleteModule, getModuleById } from "@/services/module";
import { moduleKeys } from "@/tanstack/keys/moduleKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { routes } from "@/static-data/routes";
import { LANGUAGES_MAP } from "@/static-data/languages";
import {
  Layers,
  Edit3,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Bookmark,
  Loader2Icon,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  bookmarkModule,
  getUserProgress,
  markModuleAsComplete,
} from "@/services/user";
import { userKeys } from "@/tanstack/keys/userKeys";
import { useMemo } from "react";
import { getModuleStats } from "./constants";

const ModuleDetails = () => {
  const {
    courseId = "",
    lessonId = "",
    moduleId = "",
  } = useParams<{
    courseId: string;
    lessonId: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: module } = useSuspenseQuery({
    queryKey: moduleKeys.getById(courseId, lessonId, moduleId),
    queryFn: async () => {
      return getModuleById(axiosInstance, { courseId, lessonId, id: moduleId });
    },
    select: (data) => data.module,
  });

  const { mutate: deleteModuleMutation, isPending: isDeleting } = useMutation({
    mutationKey: moduleKeys.delete(courseId, lessonId, moduleId),
    mutationFn: async () => {
      return deleteModule(axiosInstance, { courseId, lessonId, id: moduleId });
    },
    onSuccess: () => {
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    },
    meta: {
      notify: true,
      successMessage: "Module deleted successfully",
      invalidatesQueries: moduleKeys.all(courseId, lessonId),
    },
  });

  const { mutate: bookmarkModuleMutation, isPending: isBookmarking } =
    useMutation({
      mutationKey: userKeys.bookMarkModule(),
      mutationFn: async () => {
        return bookmarkModule(axiosInstance, {
          moduleId,
          bookmark: !module.isBookmarked,
        });
      },
      meta: {
        notify: false,
        invalidatesQueries: [moduleKeys.getById(courseId, lessonId, moduleId)],
      },
    });

  const { mutate: markModuleComplete, isPending: isModuleMarkingPending } =
    useMutation({
      mutationKey: userKeys.markModuleAsComplete(),
      mutationFn: async (complete: boolean) => {
        return markModuleAsComplete(axiosInstance, {
          courseId,
          moduleId,
          complete,
        });
      },
      meta: {
        notify: false,
        invalidatesQueries: [
          moduleKeys.getById(courseId, lessonId, moduleId),
          userKeys.getProgress(user?.id || ""),
          userKeys.getById(user?.id || ""),
        ],
      },
    });

  const { data: completedModuleIds } = useQuery({
    queryKey: userKeys.getProgress(user?.id || ""),
    queryFn: async () => {
      return getUserProgress(axiosInstance, { id: user?.id || "" });
    },
    enabled: !!user?.id,
    select: (data) =>
      data.progress
        .find((p) => p.course.id === courseId)
        ?.completedModules.map((m) => m.id) || [],
  });

  const isModuleCompleted = useMemo(
    () => completedModuleIds?.includes(moduleId),
    [completedModuleIds, moduleId]
  );

  const handleBookmark = () => {
    bookmarkModuleMutation();
  };

  const stats = getModuleStats(module);

  const language = module.languageId
    ? LANGUAGES_MAP.get(module.languageId)
    : undefined;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(routes.LESSON_DETAILS(courseId, lessonId))}
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to lesson
      </Button>

      <Card>
        <CardHeader className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardDescription>Module</CardDescription>
                <CardTitle className="text-3xl">{module.title}</CardTitle>
              </div>
            </div>
            <Button
              variant={module.isBookmarked ? "default" : "outline"}
              onClick={handleBookmark}
              disabled={isBookmarking}
              className="gap-2"
            >
              {isBookmarking ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {module.isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Difficulty", value: module.difficulty },
              { label: "Duration", value: stats.estimatedDuration },
              { label: "Language", value: language?.label || "Not set" },
              { label: "Updated", value: stats.lastUpdated },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-border/70 px-3 py-2"
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {user?.role === "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Admin actions
            </CardTitle>
            <CardDescription>
              Manage visibility, content, and housekeeping.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                navigate(routes.MODULE_EDIT(courseId, lessonId, moduleId))
              }
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Edit module
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => deleteModuleMutation()}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete module
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-xl">Module content</CardTitle>
            <CardDescription>
              Guidance and context for this module.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/60 bg-card/80 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {module.content}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Code example</CardTitle>
            <CardDescription>
              Reference implementation for learners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {module.code ? (
              <div className="rounded-lg border border-border/70 bg-zinc-950/95 p-4 text-sm leading-relaxed text-muted-foreground">
                <pre className="overflow-x-auto">
                  <code>{module.code}</code>
                </pre>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                No code example provided for this module.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          className="w-full max-w-md"
          variant={isModuleCompleted ? "default" : "outline"}
          onClick={() => markModuleComplete(!isModuleCompleted)}
          disabled={isModuleMarkingPending}
        >
          {isModuleMarkingPending ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : isModuleCompleted ? (
            <CheckCircle className="mr-2 h-4 w-4" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          {isModuleCompleted ? "Module completed" : "Mark as complete"}
        </Button>
      </div>
    </div>
  );
};

export default ModuleDetails;
