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
import { createQuiz, getQuiz, updateQuiz } from "@/services/quiz";
import { routes } from "@/static-data/routes";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { QuizCreateSchema, QuizUpdateSchema } from "@/types/Quiz";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain, Edit3, FileText, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type z from "zod";
import { difficultyLevels } from "../lessons/constants";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getQuizFormData, type QuizFormType } from "./constants";

const QuizCreateForm = ({ type = "create" }: QuizFormType) => {
  const { title, buttonText, subtitle, buttonLoadingText, guidelines } =
    getQuizFormData(type);
  const { courseId = "", quizId = "" } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return type === "edit"
        ? getQuiz(axiosInstance, { courseId, id: quizId })
        : null;
    },
    select: (data) => data?.quiz,
  });

  const form = useForm<z.infer<typeof QuizCreateSchema>>({
    resolver: zodResolver(QuizCreateSchema),
    defaultValues: {
      ...(type === "edit" && quiz
        ? {
            title: quiz.title,
            description: quiz.description,
            difficulty: quiz.difficulty,
            durationMinutes: quiz.durationMinutes,
            passPercentage: quiz.passPercentage,
            maxAttempts: quiz.maxAttempts,
          }
        : {}),
    },
  });

  const { mutate: createQuizMutation, isPending: isCreating } = useMutation({
    mutationKey: quizKeys.create(courseId),
    mutationFn: async (data: z.infer<typeof QuizCreateSchema>) => {
      return createQuiz(axiosInstance, { courseId }, data);
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Quiz created successfully",
      invalidatesQueries: quizKeys.all(courseId),
    },
  });

  const { mutate: updateQuizMutation, isPending: isUpdating } = useMutation({
    mutationKey: quizKeys.update(courseId, quizId),
    mutationFn: async (data: z.infer<typeof QuizUpdateSchema>) => {
      return updateQuiz(axiosInstance, { courseId, id: quizId }, data);
    },
    onSuccess: () => {
      navigate(routes.QUIZ_DETAILS(courseId, quizId));
    },
    meta: {
      notify: true,
      successMessage: "Quiz updated successfully",
      invalidatesQueries: quizKeys.all(courseId),
    },
  });

  const onSubmit = (data: z.infer<typeof QuizCreateSchema>) => {
    if (type === "create") {
      createQuizMutation(data);
    } else {
      updateQuizMutation(data);
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
            type === "edit"
              ? routes.QUIZ_DETAILS(courseId, quizId)
              : routes.COURSE_DETAILS(courseId)
          )
        }
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {type === "edit" ? "Back to quiz" : "Back to course"}
      </Button>

      <Card>
        <CardHeader className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {type === "edit" ? (
              <Edit3 className="h-6 w-6" />
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Quiz Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Brain className="h-4 w-4 text-primary" />
                        Quiz title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., JavaScript fundamentals quiz"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quiz Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this quiz covers, what students will be tested on, and any special instructions..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration in minutes */}
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/*Max Attempts */}
                <FormField
                  control={form.control}
                  name="maxAttempts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum attempts</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="e.g., 3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pass Percentage */}
                <FormField
                  control={form.control}
                  name="passPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pass percentage (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          placeholder="e.g., 70"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Difficulty Level */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Difficulty level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? buttonLoadingText : buttonText}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Quiz guidelines
            </CardTitle>
            <CardDescription>
              Keep the experience clear and scorable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {guidelines.map((guideline, index) => (
                <li key={index}>• {guideline}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizCreateForm;
