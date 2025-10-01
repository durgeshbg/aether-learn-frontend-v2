import { useNavigate, useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
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
import type z from "zod";
import {
  createCodeAssessment,
  getCodeAssessmentById,
  updateCodeAssessment,
} from "@/services/code-assesment";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { routes } from "@/static-data/routes";
import {
  CodeAssessmentCreateSchema,
  CodeAssessmentUpdateSchema,
} from "@/types/CodeAssesment";
import {
  getCodeAssessmentFormData,
  type CodeAssessmentFormType,
} from "./constants";
import { languages } from "../modules/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Code2,
  Save,
  ArrowLeft,
  Edit3,
  Plus,
  FileText,
  Terminal,
  Globe,
  Sparkles,
  BookOpen,
  Lightbulb,
  Zap,
  Target,
  Clock,
  Users,
} from "lucide-react";
import { difficultyLevels } from "../lessons/constants";
import { DifficultyLevel } from "@/types/Lesson";

const CodeAssessmentCreateForm = ({
  type = "create",
}: CodeAssessmentFormType) => {
  const { title, buttonText } = getCodeAssessmentFormData(type);
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId?: string;
  }>();
  const navigate = useNavigate();

  const { data: assessment } = useSuspenseQuery({
    queryKey: codeAssessmentKeys.getById(courseId, codeAssessmentId),
    queryFn: async () => {
      return type === "edit"
        ? getCodeAssessmentById(axiosInstance, {
            courseId,
            id: codeAssessmentId,
          })
        : null;
    },
    select: (data) => data?.codeAssessment,
  });

  const form = useForm<z.infer<typeof CodeAssessmentCreateSchema>>({
    resolver: zodResolver(CodeAssessmentCreateSchema),
    defaultValues: {
      ...(type === "edit" && assessment
        ? {
            title: assessment.title,
            description: assessment.description,
            instructions: assessment.instructions,
            starterCode: assessment.starterCode,
            languageId: parseInt(assessment?.languageId),
            durationMinutes: assessment.durationMinutes,
            difficulty: assessment.difficulty ?? DifficultyLevel.BEGINNER,
          }
        : {
            languageId: languages[7].value,
          }),
    },
  });

  const { mutate: createCodeAssessmentMutation, isPending: isCreating } =
    useMutation({
      mutationKey: codeAssessmentKeys.create(courseId),
      mutationFn: async (data: z.infer<typeof CodeAssessmentCreateSchema>) => {
        return createCodeAssessment(axiosInstance, { courseId }, data);
      },
      onSuccess: () => {
        navigate(routes.COURSE_DETAILS(courseId));
      },
      meta: {
        notify: true,
        successMessage: "Code Assessment created successfully",
        invalidatesQueries: codeAssessmentKeys.all(courseId),
      },
    });

  const { mutate: updateCodeAssessmentMutation, isPending: isUpdating } =
    useMutation({
      mutationKey: codeAssessmentKeys.update(courseId, codeAssessmentId),
      mutationFn: async (data: z.infer<typeof CodeAssessmentUpdateSchema>) => {
        return updateCodeAssessment(
          axiosInstance,
          { courseId, id: codeAssessmentId },
          data,
        );
      },
      onSuccess: () => {
        navigate(routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId));
      },
      meta: {
        notify: true,
        successMessage: "Code Assessment updated successfully",
        invalidatesQueries: codeAssessmentKeys.all(courseId),
      },
    });

  const onSubmit = (data: z.infer<typeof CodeAssessmentCreateSchema>) => {
    if (type === "create") {
      createCodeAssessmentMutation(data);
    } else {
      updateCodeAssessmentMutation(data);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() =>
            navigate(
              type === "edit"
                ? routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId)
                : routes.COURSE_DETAILS(courseId),
            )
          }
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {type === "edit" ? "Back to Assessment" : "Back to Course"}
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
                  ? "Update coding assessment details and requirements"
                  : "Create a comprehensive coding challenge for students to solve"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-sm">
              {type === "edit"
                ? "Make your changes and save to update the assessment"
                : "Fill in the assessment details to create a coding challenge"}
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
                {/* Assessment Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Code2 className="h-5 w-5 text-emerald-400" />
                        Assessment Title
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter assessment title (e.g., Two Sum Algorithm Challenge)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Assessment Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <FileText className="h-5 w-5 text-blue-400" />
                        Problem Description
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Describe the coding problem clearly. What should the function do? What are the inputs and expected outputs?"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[120px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Instructions Field */}
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        Detailed Instructions
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Provide step-by-step instructions, constraints, examples, and any specific requirements..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[150px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Tip:</strong>{" "}
                          Include examples with inputs and outputs, mention
                          time/space complexity requirements, and specify any
                          constraints or edge cases.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Duration in minutes */}
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Duration (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 30"
                          className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Difficulty Level */}
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

                {/* Starter Code Field */}
                <FormField
                  control={form.control}
                  name="starterCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Terminal className="h-5 w-5 text-purple-400" />
                        Starter Code Template
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Provide the initial code template that students will start with..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-gray-900/30 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-gray-900/50 focus:border-white/40 transition-all duration-300 min-h-[200px] resize-y font-mono text-sm"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Tip:</strong>{" "}
                          Include function signatures, basic structure, and
                          helpful comments. Students should be able to focus on
                          the algorithm rather than setup.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Programming Language Field */}
                <FormField
                  control={form.control}
                  name="languageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Globe className="h-5 w-5 text-blue-400" />
                        Programming Language
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 text-white bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300">
                            <SelectValue placeholder="Select programming language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white/10 backdrop-blur-2xl border-white/20 rounded-xl">
                          {languages.map((language) => (
                            <SelectItem
                              key={language.value}
                              value={language.value.toString()}
                              className="text-white hover:bg-white/20 focus:bg-white/20"
                            >
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                            ? "Updating Assessment..."
                            : "Creating Assessment..."}
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
                      ? "Changes will be immediately visible to all students with access to this course"
                      : "Once created, you can add test cases to validate student solutions automatically"}
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assessment Guidelines */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Target className="h-5 w-5 text-emerald-400" />
              Assessment Guidelines
            </h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Write clear, unambiguous problem statements</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Provide comprehensive examples with explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include helpful starter code and comments</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Specify constraints and edge cases clearly</span>
              </li>
            </ul>
          </div>

          {/* Difficulty Estimation */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Zap className="h-5 w-5 text-yellow-400" />
              Difficulty Estimation
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-400/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-green-300 font-medium text-sm">
                    Easy
                  </span>
                </div>
                <p className="text-green-200 text-xs">
                  Basic algorithms, simple data structures
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-yellow-300 font-medium text-sm">
                    Medium
                  </span>
                </div>
                <p className="text-yellow-200 text-xs">
                  Multiple concepts, optimization required
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-red-300 font-medium text-sm">Hard</span>
                </div>
                <p className="text-red-200 text-xs">
                  Complex algorithms, advanced techniques
                </p>
              </div>
            </div>
          </div>

          {/* Time Estimates */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Clock className="h-5 w-5 text-blue-400" />
              Time Estimates
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Easy Problems</span>
                <span className="text-white font-medium">15-30 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Medium Problems</span>
                <span className="text-white font-medium">30-60 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Hard Problems</span>
                <span className="text-white font-medium">60+ min</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Users className="h-5 w-5 text-purple-400" />
              {type === "edit" ? "After Updating" : "Next Steps"}
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {type === "edit" ? (
                <>
                  <li>• Review and test the updated starter code</li>
                  <li>• Update existing test cases if needed</li>
                  <li>• Notify students about significant changes</li>
                </>
              ) : (
                <>
                  <li>• Add comprehensive test cases</li>
                  <li>• Test the solution with edge cases</li>
                  <li>• Set appropriate time limits</li>
                  <li>• Preview the assessment before publishing</li>
                </>
              )}
            </ul>
          </div>

          {/* Code Best Practices */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              Starter Code Tips
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Include clear function signatures</li>
              <li>• Add helpful comments and docstrings</li>
              <li>• Provide basic structure and imports</li>
              <li>• Include example test calls</li>
              <li>• Keep code clean and readable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAssessmentCreateForm;
