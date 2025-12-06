import { useNavigate, useParams } from "react-router";
import { getQuestionFormData, type QuestionFormType } from "./constants";
import { QuestionCreateSchema, QuestionUpdateSchema } from "@/types/Question";
import { routes } from "@/static-data/routes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import type z from "zod";
import {
  createQuestion,
  getQuestions,
  updateQuestion,
} from "@/services/question";
import { questionKeys } from "@/tanstack/keys/question";
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
import {
  ArrowLeft,
  Edit3,
  Plus,
  HelpCircle,
  ListChecks,
  Lightbulb,
  Target,
  X,
  CheckCircle,
} from "lucide-react";

const QuestionCreateForm = ({ type = "create" }: QuestionFormType) => {
  const { title, buttonText, guidelines, buttonLoadingText, subtitle } =
    getQuestionFormData(type);
  const {
    courseId = "",
    quizId = "",
    questionId = "",
  } = useParams<{
    courseId: string;
    quizId: string;
    questionId: string;
  }>();
  const navigate = useNavigate();

  const { data: question } = useSuspenseQuery({
    queryKey: questionKeys.all(courseId, quizId),
    queryFn: async () => {
      return type === "edit"
        ? getQuestions(axiosInstance, { courseId, quizId })
        : null;
    },
    select: (data) => {
      return data?.questions.find((q) => q.id === questionId) || null;
    },
  });

  const form = useForm<z.infer<typeof QuestionCreateSchema>>({
    resolver: zodResolver(QuestionCreateSchema),
    defaultValues: {
      ...(type === "edit" && question
        ? {
            text: question.text,
            options: question.options,
            answer: question.answer,
            explanation: question.explanation,
          }
        : {
            text: "",
            options: ["Option 1", "Option 2"],
            answer: 1,
            explanation: "",
          }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "options" as never,
    control: form.control,
  });

  const { mutate: createQuestionMutation, isPending: isCreating } = useMutation(
    {
      mutationKey: questionKeys.create(courseId, quizId),
      mutationFn: async (data: z.infer<typeof QuestionCreateSchema>) => {
        return createQuestion(axiosInstance, { courseId, quizId }, data);
      },
      onSuccess: () => {
        navigate(routes.QUIZ_DETAILS(courseId, quizId));
      },
      meta: {
        notify: true,
        successMessage: "Question created successfully",
        invalidatesQueries: questionKeys.all(courseId, quizId),
      },
    }
  );

  const { mutate: updateQuestionMutation, isPending: isUpdating } = useMutation(
    {
      mutationKey: questionKeys.update(courseId, quizId, questionId),
      mutationFn: async (data: z.infer<typeof QuestionUpdateSchema>) => {
        return updateQuestion(
          axiosInstance,
          { courseId, quizId, id: questionId },
          data
        );
      },
      onSuccess: () => {
        navigate(routes.QUIZ_DETAILS(courseId, quizId));
      },
      meta: {
        notify: true,
        successMessage: "Question updated successfully",
        invalidatesQueries: questionKeys.all(courseId, quizId),
      },
    }
  );

  const onSubmit = (data: z.infer<typeof QuestionCreateSchema>) => {
    if (type === "create") {
      createQuestionMutation(data);
    } else {
      updateQuestionMutation(data);
    }
  };

  const isSubmitting = isCreating || isUpdating;
  const watchedAnswer = form.watch("answer");

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(routes.QUIZ_DETAILS(courseId, quizId))}
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quiz
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
                {/* Question Text Field */}
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        Question text
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your quiz question..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Answer Options */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ListChecks className="h-4 w-4 text-emerald-500" />
                      Answer options
                    </FormLabel>
                    <Button type="button" size="sm" onClick={() => append("")}>
                      <Plus className="mr-2 h-3 w-3" />
                      Add option
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="relative">
                        <FormField
                          control={form.control}
                          name={`options.${index}` as never}
                          render={({ field: optionField }) => (
                            <FormItem>
                              <div className="flex items-center gap-3">
                                {/* Option Number/Indicator */}
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm font-semibold ${
                                    watchedAnswer === index + 1
                                      ? "border-primary/40 bg-primary/10 text-primary"
                                      : "border-border/60 text-muted-foreground"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </div>

                                {/* Option Input */}
                                <FormControl>
                                  <div className="relative flex-1">
                                    <Input
                                      placeholder={`Enter option ${String.fromCharCode(
                                        65 + index
                                      )}`}
                                      {...optionField}
                                    />
                                    {watchedAnswer === index + 1 && (
                                      <CheckCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                    )}
                                  </div>
                                </FormControl>

                                {/* Remove Button */}
                                {fields.length > 2 && (
                                  <Button
                                    type="button"
                                    onClick={() => remove(index)}
                                    variant="ghost"
                                    size="icon"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <FormMessage className="ml-11" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer Field */}
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Target className="h-4 w-4 text-primary" />
                        Correct answer
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="Option number (1, 2, 3...)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Explanation Field */}
                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        Explanation
                        <span className="text-xs text-muted-foreground">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why this option is correct."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
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
              Question guidelines
            </CardTitle>
            <CardDescription>
              Keep prompts focused and scorable.
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

export default QuestionCreateForm;
