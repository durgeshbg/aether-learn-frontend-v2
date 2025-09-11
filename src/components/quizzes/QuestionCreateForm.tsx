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
  Brain,
  Save,
  ArrowLeft,
  Edit3,
  Plus,
  HelpCircle,
  ListChecks,
  Lightbulb,
  Target,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";

const QuestionCreateForm = ({ type = "create" }: QuestionFormType) => {
  const { title, buttonText } = getQuestionFormData(type);
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
            explaination: question.explaination,
          }
        : {
            text: "",
            options: ["Option 1", "Option 2"],
            answer: 1,
            explaination: "",
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
    },
  );

  const { mutate: updateQuestionMutation, isPending: isUpdating } = useMutation(
    {
      mutationKey: questionKeys.update(courseId, quizId, questionId),
      mutationFn: async (data: z.infer<typeof QuestionUpdateSchema>) => {
        return updateQuestion(
          axiosInstance,
          { courseId, quizId, id: questionId },
          data,
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
    },
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
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() => navigate(routes.QUIZ_DETAILS(courseId, quizId))}
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quiz
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/20">
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
                  ? "Update quiz question and answer options"
                  : "Create an engaging quiz question to test student knowledge"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-sm">
              {type === "edit"
                ? "Make your changes and save to update the question"
                : "Create a clear question with multiple choice options"}
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
                {/* Question Text Field */}
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <HelpCircle className="h-5 w-5 text-blue-400" />
                        Question Text
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Enter your quiz question here. Be clear and specific about what you're asking..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[100px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Answer Options */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                      <ListChecks className="h-5 w-5 text-emerald-400" />
                      Answer Options
                    </FormLabel>
                    <Button
                      type="button"
                      onClick={() => append("")}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      Add Option
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
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm border-2 ${
                                    watchedAnswer === index + 1
                                      ? "bg-green-500/20 border-green-400 text-green-400"
                                      : "bg-white/10 border-white/30 text-white/70"
                                  }`}
                                >
                                  {String.fromCharCode(65 + index)}
                                </div>

                                {/* Option Input */}
                                <FormControl>
                                  <div className="flex-1 relative">
                                    <Input
                                      placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                                      className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                                      {...optionField}
                                    />
                                    {watchedAnswer === index + 1 && (
                                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                                    )}
                                  </div>
                                </FormControl>

                                {/* Remove Button */}
                                {fields.length > 2 && (
                                  <Button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 p-2 rounded-lg transition-all duration-300"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <FormMessage className="text-red-400 text-sm ml-11" />
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
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Target className="h-5 w-5 text-green-400" />
                        Correct Answer
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            min="1"
                            max={fields.length}
                            placeholder="Enter the number of the correct option (1, 2, 3...)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 1)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Selected:</strong>{" "}
                          Option {watchedAnswer}
                          {fields[watchedAnswer - 1] &&
                            ` - ${form.getValues(`options.${watchedAnswer - 1}`)}`}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Explanation Field */}
                <FormField
                  control={form.control}
                  name="explanation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        Explanation
                        <span className="text-white/50 text-sm font-normal ml-2">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Explain why this is the correct answer. This helps students learn from their mistakes..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[100px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
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
                            ? "Updating Question..."
                            : "Creating Question..."}
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
                      ? "Changes will be immediately visible to students taking this quiz"
                      : "Once created, this question will be added to the quiz for student assessment"}
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Question Guidelines */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Brain className="h-5 w-5 text-purple-400" />
              Question Guidelines
            </h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Ask clear, specific questions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Provide 3-5 answer options</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Make incorrect options plausible</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include helpful explanations</span>
              </li>
            </ul>
          </div>

          {/* Current Question Preview */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              Question Preview
            </h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/90 mb-3 font-medium">
                {form.watch("text") || "Your question will appear here..."}
              </p>
              <div className="space-y-2">
                {fields.map((_, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      watchedAnswer === index + 1
                        ? "bg-green-500/20 border border-green-400/30"
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-white/70 font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-white/80 text-sm">
                      {form.watch(`options.${index}`) || `Option ${index + 1}`}
                    </span>
                    {watchedAnswer === index + 1 && (
                      <CheckCircle className="h-3 w-3 text-green-400 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              Best Practices
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Test knowledge, not memory</li>
              <li>• Avoid trick questions</li>
              <li>• Use consistent formatting</li>
              <li>• Review for clarity and accuracy</li>
              <li>• Consider different skill levels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCreateForm;
