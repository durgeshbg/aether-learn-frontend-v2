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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate(
            type === "edit" ? routes.COURSE_DETAILS(courseId) : routes.COURSES,
          )
        }
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {type === "edit" ? "Back to course" : "Back to courses"}
      </Button>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {type === "edit" ? (
                <Edit3 className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardDescription>
                {type === "edit" ? "Update course" : "Create course"}
              </CardDescription>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {type === "edit"
                  ? "Adjust details and publish changes."
                  : "Provide foundational details before adding lessons."}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {type === "edit" ? "Editing existing course" : "New course draft"}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course information</CardTitle>
          <CardDescription>
            Keep titles concise and descriptions outcome-focused.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...createOrUpdateForm}>
            <form
              onSubmit={createOrUpdateForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={createOrUpdateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Course name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="React Fundamentals" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createOrUpdateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4 text-primary" />
                      Course description
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe what learners will achieve..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createOrUpdateForm.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Thumbnail URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/thumbnail.png"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Ideal size 1200×600px. Displayed on course cards and
                      details.
                    </p>
                    <FormMessage />
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
                      {type === "edit"
                        ? "Updating course..."
                        : "Creating course..."}
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
    </div>
  );
};

export default CourseCreateForm;
