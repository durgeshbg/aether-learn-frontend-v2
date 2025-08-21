import { useForm } from "react-hook-form";
import { getLessonFormData, type LessonFormType } from "./constants";
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
  PlayCircle,
  Save,
  ArrowLeft,
  Edit3,
  Plus,
  BookOpen,
  FileText,
  Sparkles,
  Clock,
  Users,
} from "lucide-react";

const LessonCreateForm = ({ type = "create" }: LessonFormType) => {
  const { courseId = "", lessonId = "" } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { title, buttonText } = getLessonFormData(type);
  const navigate = useNavigate();

  const { data: lesson } = useSuspenseQuery({
    queryKey: lessonKeys.getById(courseId, lessonId),
    queryFn: async () => {
      return type === "edit"
        ? getLessonById(axiosInstance, { courseId, id: lessonId })
        : null;
    },
    select: (data: { lesson: Lesson }) => data?.lesson,
  });

  const form = useForm<z.infer<typeof LessonCreateSchema>>({
    resolver: zodResolver(LessonCreateSchema),
    defaultValues: {
      ...(type === "edit" && lesson
        ? {
            title: lesson.title,
            content: lesson.content,
          }
        : {}),
    },
  });

  const { mutate: createLessonMutation, isPending: isCreating } = useMutation({
    mutationKey: lessonKeys.create(courseId),
    mutationFn: async (data: z.infer<typeof LessonCreateSchema>) => {
      return createLesson(axiosInstance, { courseId }, data);
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
      return updateLesson(axiosInstance, { courseId, id: lessonId }, data);
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
          {type === "edit" ? "Back to Lesson" : "Back to Course"}
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
              {type === "edit" ? (
                <Edit3 className="h-8 w-8 text-white/80" />
              ) : (
                <Plus className="h-8 w-8 text-white/80" />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
              <p className="text-white/70 text-lg">
                {type === "edit"
                  ? "Update lesson content and settings"
                  : "Create engaging lesson content for your students"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-sm">
              {type === "edit"
                ? "Make your changes and save to update the lesson"
                : "Fill in the lesson details to create engaging content"}
            </span>
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
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Tip:</strong> Use
                          clear explanations, examples, and step-by-step
                          instructions. Consider adding interactive elements and
                          practical exercises to enhance learning.
                        </p>
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
                        <span>
                          {type === "edit"
                            ? "Updating Lesson..."
                            : "Creating Lesson..."}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="h-5 w-5" />
                        <span>{buttonText}</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Form Footer */}
                <div className="pt-4 text-center">
                  <p className="text-white/50 text-sm">
                    {type === "edit"
                      ? "Changes will be saved immediately and visible to all students"
                      : "Once created, you can add modules and interactive content to your lesson"}
                  </p>
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
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Start with clear learning objectives</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Break content into digestible sections</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include practical examples and exercises</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>End with a summary and next steps</span>
              </li>
            </ul>
          </div>

          {/* Estimated Metrics */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Clock className="h-5 w-5 text-blue-400" />
              Estimated Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Reading Time</span>
                <span className="text-white font-medium">~15 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Difficulty</span>
                <span className="text-emerald-400 font-medium">Beginner</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Completion</span>
                <span className="text-white font-medium">~20 min</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Users className="h-5 w-5 text-yellow-400" />
              {type === "edit" ? "After Updating" : "Next Steps"}
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {type === "edit" ? (
                <>
                  <li>• Review the updated content for clarity</li>
                  <li>• Notify students about significant changes</li>
                  <li>• Consider updating related modules</li>
                </>
              ) : (
                <>
                  <li>• Add interactive modules to enhance learning</li>
                  <li>• Create quizzes to test understanding</li>
                  <li>• Include multimedia content for engagement</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCreateForm;
