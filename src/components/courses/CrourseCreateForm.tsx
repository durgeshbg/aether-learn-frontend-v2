import { useForm } from "react-hook-form";
import { getCourseFormData, type CourseFormType } from "./constants";
import { CourseCreateSchema, CourseUpdateSchema } from "@/types/Course";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createCourse, getCourseById, updateCourse } from "@/services/course";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router";
import { routes } from "@/static-data/routes";
import {
  BookOpen,
  Save,
  ArrowLeft,
  Edit3,
  Plus,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from "lucide-react";

const CourseCreateForm = ({ type = "create" }: CourseFormType) => {
  const { title, buttonText } = getCourseFormData(type);
  const navigate = useNavigate();
  const { courseId = "" } = useParams<{ courseId: string }>();

  const { data: course } = useSuspenseQuery({
    queryKey: courseKeys.getById(type === "edit" ? courseId : ""),
    queryFn: async () => {
      return type === "edit"
        ? getCourseById(axiosInstance, { id: courseId })
        : null;
    },
    select: (data) => data?.course,
  });

  const createOrUpdateForm = useForm<z.infer<typeof CourseCreateSchema>>({
    resolver: zodResolver(CourseCreateSchema),
    defaultValues: {
      ...(type === "edit" && course
        ? {
            name: course.name,
            description: course.description,
            thumbnailUrl: course.thumbnailUrl,
          }
        : {}),
    },
  });

  const { mutate: createCourseMutation, isPending: isCreating } = useMutation({
    mutationKey: courseKeys.create(),
    mutationFn: async (data: z.infer<typeof CourseCreateSchema>) => {
      return createCourse(axiosInstance, data);
    },
    meta: {
      notify: true,
      successMessage: "Course created successfully",
      invalidatesQueries: courseKeys.all(),
    },
    onSettled: () => {
      createOrUpdateForm.reset();
      navigate(routes.COURSES);
    },
  });

  const { mutate: updateCourseMutation, isPending: isUpdating } = useMutation({
    mutationKey: courseKeys.update(courseId),
    mutationFn: async (data: z.infer<typeof CourseUpdateSchema>) => {
      return updateCourse(axiosInstance, { id: courseId }, data);
    },
    meta: {
      notify: true,
      successMessage: "Course updated successfully",
      invalidatesQueries: courseKeys.all(),
    },
    onSettled: () => {
      createOrUpdateForm.reset();
      navigate(routes.COURSES);
    },
  });

  const onSubmit = (
    data:
      | z.infer<typeof CourseCreateSchema>
      | z.infer<typeof CourseUpdateSchema>,
  ) => {
    if (type === "edit") {
      updateCourseMutation(data as z.infer<typeof CourseUpdateSchema>);
    } else {
      createCourseMutation(data as z.infer<typeof CourseCreateSchema>);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() => navigate(routes.COURSES)}
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/20">
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
                  ? "Update course information and settings"
                  : "Create a new course for your learners"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-sm">
              {type === "edit"
                ? "Make your changes and save to update the course"
                : "Fill in the details below to create your course"}
            </span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
        <Form {...createOrUpdateForm}>
          <form
            onSubmit={createOrUpdateForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Course Name Field */}
            <FormField
              control={createOrUpdateForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    Course Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter course name (e.g., React Fundamentals)"
                        className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            {/* Course Description Field */}
            <FormField
              control={createOrUpdateForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    Course Description
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Describe what students will learn in this course"
                        className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                </FormItem>
              )}
            />

            {/* Thumbnail URL Field */}
            <FormField
              control={createOrUpdateForm.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                    <ImageIcon className="h-5 w-5 text-purple-400" />
                    Thumbnail URL
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="https://example.com/course-thumbnail.jpg"
                        className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm" />
                  <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/60 text-sm">
                      <strong className="text-white/80">Tip:</strong> Use a
                      high-quality image (1200x600px recommended) that
                      represents your course content. This will be displayed on
                      course cards and details.
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
                        ? "Updating Course..."
                        : "Creating Course..."}
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
                  ? "Changes will be saved immediately and visible to all enrolled students"
                  : "Once created, you can add lessons, quizzes, and assessments to your course"}
              </p>
            </div>
          </form>
        </Form>
      </div>

      {/* Additional Info Section */}
      <div className="mt-8 rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-3">
          {type === "edit" ? "Editing Tips" : "Next Steps"}
        </h3>
        <ul className="space-y-2 text-white/70 text-sm">
          {type === "edit" ? (
            <>
              <li>
                • Changes to course name and description are immediately visible
              </li>
              <li>
                • Update the thumbnail to keep your course visually appealing
              </li>
              <li>
                • Consider notifying enrolled students about significant changes
              </li>
            </>
          ) : (
            <>
              <li>
                • After creating, you can add lessons to build your curriculum
              </li>
              <li>• Create quizzes to test student understanding</li>
              <li>• Add code assessments for hands-on practice</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CourseCreateForm;
