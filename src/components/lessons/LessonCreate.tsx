import { useForm } from "react-hook-form";
import {
  difficultyLevels,
  getLessonFormData,
  type LessonFormType,
} from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LessonCreateSchema,
  LessonUpdateSchema,
  type Lesson,
} from "@/types/Lesson";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { lessonKeys } from "@/tanstack/keys/lessonKeys";
import { useNavigate, useParams } from "react-router";
import { createLesson, getLessonById, updateLesson } from "@/services/lesson";
import { axiosInstance } from "@/utils/axiosInstance";
import { routes } from "@/static-data/routes";
import type z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PlayCircle, Save, ArrowLeft, BookOpen, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const LessonCreateForm = ({ type = "create" }: LessonFormType) => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const {
    title,
    buttonText,
    subtitle,
    icon,
    contentTip,
    objectivesTip,
    buttonLoadingText,
    guidelines,
    backLinkText,
  } = getLessonFormData(type);
  const navigate = useNavigate();

  const { data: lesson } = useSuspenseQuery({
    queryKey: lessonKeys.getById(courseId, lessonId),
    queryFn: async () => {
      return type === "edit"
        ? getLessonById(axiosInstance, { courseId, id: lessonId })
        : null;
    },
    select: (data) => data?.lesson,
  });

  const form = useForm<z.infer<typeof LessonCreateSchema>>({
    resolver: zodResolver(LessonCreateSchema),
    defaultValues: {
      ...(type === "edit" && lesson
        ? {
            title: lesson.title,
            content: lesson.content,
            difficulty: (lesson as Lesson).difficulty,
            objectives: lesson.objectives?.join(", ") || "",
          }
        : {}),
    },
  });

  const { mutate: createLessonMutation, isPending: isCreating } = useMutation({
    mutationKey: lessonKeys.create(courseId),
    mutationFn: async (data: z.infer<typeof LessonCreateSchema>) => {
      const objectives = data.objectives
        ? data.objectives.split(",").map((obj) => obj.trim())
        : undefined;
      return createLesson(axiosInstance, { courseId }, { ...data, objectives });
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Lesson created successfully",
      invalidatesQueries: lessonKeys.all(courseId),
    },
  });

  const { mutate: updateLessonMutation, isPending: isUpdating } = useMutation({
    mutationKey: lessonKeys.update(courseId, lessonId),
    mutationFn: async (data: z.infer<typeof LessonUpdateSchema>) => {
      const objectives = data.objectives
        ? data.objectives.split(",").map((obj) => obj.trim())
        : undefined;
      return updateLesson(
        axiosInstance,
        { courseId, id: lessonId },
        { ...data, objectives },
      );
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    },
    meta: {
      notify: true,
      successMessage: "Lesson updated successfully",
      invalidatesQueries: lessonKeys.all(courseId),
    },
  });

  const onSubmit = (
    data:
      | z.infer<typeof LessonCreateSchema>
      | z.infer<typeof LessonUpdateSchema>,
  ) => {
    if (type === "create") {
      createLessonMutation(data as z.infer<typeof LessonCreateSchema>);
    } else {
      updateLessonMutation(data as z.infer<typeof LessonUpdateSchema>);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate(
            type === "edit"
              ? routes.LESSON_DETAILS(courseId, lessonId)
              : routes.COURSE_DETAILS(courseId),
          )
        }
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLinkText}
      </Button>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <CardDescription>
                {type === "edit" ? "Update lesson" : "Create lesson"}
              </CardDescription>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lesson content</CardTitle>
            <CardDescription>
              Explain the concept, provide context, and outline objectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <PlayCircle className="h-4 w-4 text-primary" />
                        Lesson title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introduction to React Hooks"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4 text-primary" />
                        Lesson content
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain the concept, provide examples, and guide learners through the steps..."
                          className="min-h-[200px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {contentTip}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lesson Difficulty */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Difficulty Level
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/40 backdrop-blur-sm focus:bg-background/70 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                            <SelectValue placeholder="Difficulty level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card/95 backdrop-blur-md border-border/40">
                          {difficultyLevels.map((level) => {
                            return (
                              <SelectItem
                                key={level.value}
                                value={level.value}
                                className="focus:bg-primary/10"
                              >
                                <div className="flex items-center gap-3">
                                  <div>
                                    <p className="font-medium">{level.label}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lesson Objectives */}
                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Learning Objectives
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="List the key learning objectives for this lesson, separated by commas (e.g., Understand React Hooks, Build functional components)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[100px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">{objectivesTip}</p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {buttonLoadingText}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {buttonText}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guidelines</CardTitle>
              <CardDescription>
                Keep lessons actionable and modular.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {guidelines.map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonCreateForm;
