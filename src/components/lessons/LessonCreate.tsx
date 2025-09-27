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
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() =>
            navigate(
              type === "edit"
                ? routes.LESSON_DETAILS(courseId, lessonId)
                : routes.COURSE_DETAILS(courseId),
            )
          }
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backLinkText}
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
              {icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
              <p className="text-white/70 text-lg">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Lesson Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <PlayCircle className="h-5 w-5 text-emerald-400" />
                        Lesson Title
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter lesson title (e.g., Introduction to React Hooks)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Lesson Content Field */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <FileText className="h-5 w-5 text-blue-400" />
                        Lesson Content
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Write your lesson content here. Explain the concepts, provide examples, and guide students through the learning process..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[200px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">{contentTip}</p>
                      </div>
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

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] shadow-xl ${
                      type === "edit"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    } text-white ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{buttonLoadingText}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="h-5 w-5" />
                        <span>{buttonText}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Guidelines */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <BookOpen className="h-5 w-5 text-purple-400" />
              Lesson Guidelines
            </h3>
            <ul className="space-y-3 text-white/70 text-sm">
              {guidelines.map((line, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCreateForm;
