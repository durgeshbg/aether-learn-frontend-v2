import { useNavigate, useParams } from "react-router";
import { getQuizFormData, type QuizFormType } from "./constants";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { createQuiz, getQuiz, updateQuiz } from "@/services/quiz";
import { QuizCreateSchema, QuizUpdateSchema, type Quiz } from "@/types/Quiz";
import { routes } from "@/static-data/routes";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  FileText,
  Target,
  Sparkles,
  BookOpen,
  Timer,
  Users,
  Award,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const QuizCreateForm = ({ type = "create" }: QuizFormType) => {
  const { title, buttonText } = getQuizFormData(type);
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
    select: (data: { quiz: Quiz }) => data?.quiz,
  });

  const form = useForm<z.infer<typeof QuizCreateSchema>>({
    resolver: zodResolver(QuizCreateSchema),
    defaultValues: {
      ...(type === "edit" && quiz
        ? {
            title: quiz.title,
            description: quiz.description,
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
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() =>
            navigate(
              type === "edit"
                ? routes.QUIZ_DETAILS(courseId, quizId)
                : routes.COURSE_DETAILS(courseId),
            )
          }
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {type === "edit" ? "Back to Quiz" : "Back to Course"}
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
                  ? "Update quiz information and settings"
                  : "Create an engaging quiz to test student knowledge and understanding"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-sm">
              {type === "edit"
                ? "Make your changes and save to update the quiz"
                : "Fill in the quiz details to create an assessment for your students"}
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
                {/* Quiz Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Brain className="h-5 w-5 text-purple-400" />
                        Quiz Title
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter quiz title (e.g., JavaScript Fundamentals Quiz)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Quiz Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <FileText className="h-5 w-5 text-blue-400" />
                        Quiz Description
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Describe what this quiz covers, what students will be tested on, and any special instructions..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[120px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Tip:</strong>{" "}
                          Provide clear instructions about the quiz format,
                          difficulty level, and what topics will be covered to
                          help students prepare effectively.
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
                            ? "Updating Quiz..."
                            : "Creating Quiz..."}
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
                      ? "Changes will be immediately visible to all enrolled students"
                      : "Once created, you can add questions and configure quiz settings"}
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quiz Guidelines */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Target className="h-5 w-5 text-emerald-400" />
              Quiz Guidelines
            </h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Create a clear, descriptive title</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Explain the quiz format and expectations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Mention the difficulty level</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include estimated completion time</span>
              </li>
            </ul>
          </div>

          {/* Quiz Features */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Award className="h-5 w-5 text-yellow-400" />
              Quiz Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <HelpCircle className="h-4 w-4 text-blue-400" />
                <span className="text-white/80 text-sm">
                  Multiple choice questions
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Timer className="h-4 w-4 text-purple-400" />
                <span className="text-white/80 text-sm">Timed assessments</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-white/80 text-sm">Instant feedback</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <Users className="h-4 w-4 text-yellow-400" />
                <span className="text-white/80 text-sm">Progress tracking</span>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Best Practices
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Align questions with learning objectives</li>
              <li>• Mix question types and difficulty levels</li>
              <li>• Provide helpful explanations for answers</li>
              <li>• Test your quiz before publishing</li>
              <li>• Set reasonable time limits</li>
              <li>• Include progress indicators</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Sparkles className="h-5 w-5 text-purple-400" />
              {type === "edit" ? "After Updating" : "Next Steps"}
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {type === "edit" ? (
                <>
                  <li>• Review existing questions for accuracy</li>
                  <li>• Update quiz settings if needed</li>
                  <li>• Notify students about changes</li>
                </>
              ) : (
                <>
                  <li>• Add questions to your quiz</li>
                  <li>• Configure quiz settings and timing</li>
                  <li>• Preview before making it available</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreateForm;
