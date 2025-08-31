import { useNavigate, useParams } from "react-router";
import { getModuleFormData, languages, type ModuleFormType } from "./constnats";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { moduleKeys } from "@/tanstack/keys/moduleKeys";
import { createModule, getModuleById, updateModule } from "@/services/module";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  ModuleCreateSchema,
  ModuleUpdateSchema,
  type Module,
} from "@/types/Module";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { routes } from "@/static-data/routes";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Layers,
  Save,
  ArrowLeft,
  Edit3,
  Plus,
  FileText,
  Code2,
  Globe,
  Sparkles,
  BookOpen,
  Lightbulb,
  Zap,
  Target,
} from "lucide-react";
import { difficultyLevels } from "../lessons/constants";

const ModuleCreateForm = ({ type = "create" }: ModuleFormType) => {
  const {
    courseId = "",
    lessonId = "",
    moduleId = "",
  } = useParams<{
    courseId: string;
    lessonId: string;
    moduleId: string;
  }>();
  const { title, buttonText } = getModuleFormData(type);
  const navigate = useNavigate();

  const { data: module } = useSuspenseQuery({
    queryKey: moduleKeys.getById(courseId, lessonId, moduleId),
    queryFn: async () => {
      return type === "edit"
        ? getModuleById(axiosInstance, { courseId, lessonId, id: moduleId })
        : null;
    },
    select: (data: { module: Module }) => data?.module,
  });

  const form = useForm<z.infer<typeof ModuleCreateSchema>>({
    resolver: zodResolver(ModuleCreateSchema),
    defaultValues: {
      ...(type === "edit" && module
        ? {
            title: module.title,
            content: module.content,
            code: module?.code,
            languageId: module?.languageId,
            difficulty: module.difficulty,
            objectives: module.objectives ? module.objectives.join(", ") : "",
            durationMinutes: module.durationMinutes,
          }
        : {
            languageId: languages[7].value,
          }),
    },
  });

  const { mutate: createModuleMutation, isPending: isCreating } = useMutation({
    mutationKey: moduleKeys.create(courseId, lessonId),
    mutationFn: async (data: z.infer<typeof ModuleCreateSchema>) => {
      const objectives = data.objectives
        ? data.objectives.split(",").map((obj) => obj.trim())
        : undefined;
      return createModule(
        axiosInstance,
        { courseId, lessonId },
        { ...data, objectives },
      );
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    },
    meta: {
      notify: true,
      successMessage: "Module created successfully",
      invalidatesQueries: moduleKeys.all(courseId, lessonId),
    },
  });

  const { mutate: updateModuleMutation, isPending: isUpdating } = useMutation({
    mutationKey: moduleKeys.update(courseId, lessonId, moduleId),
    mutationFn: async (data: z.infer<typeof ModuleUpdateSchema>) => {
      const objectives = data.objectives
        ? data.objectives.split(",").map((obj) => obj.trim())
        : undefined;
      return updateModule(
        axiosInstance,
        { courseId, lessonId, id: moduleId },
        { ...data, objectives },
      );
    },
    onSuccess: () => {
      form.reset();
      navigate(routes.MODULE_DETAILS(courseId, lessonId, moduleId));
    },
    meta: {
      notify: true,
      successMessage: "Module updated successfully",
      invalidatesQueries: moduleKeys.all(courseId, lessonId),
    },
  });

  const onSubmit = (
    data:
      | z.infer<typeof ModuleCreateSchema>
      | z.infer<typeof ModuleUpdateSchema>,
  ) => {
    if (type === "create") {
      createModuleMutation(data as z.infer<typeof ModuleCreateSchema>);
    } else {
      updateModuleMutation(data as z.infer<typeof ModuleUpdateSchema>);
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
                ? routes.MODULE_DETAILS(courseId, lessonId, moduleId)
                : routes.LESSON_DETAILS(courseId, lessonId),
            )
          }
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {type === "edit" ? "Back to Module" : "Back to Lesson"}
        </Button>

        <div className="rounded-2xl p-8 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 flex items-center justify-center border border-white/20">
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
                  ? "Update module content and coding examples"
                  : "Create an interactive learning module with content and code"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-sm">
              {type === "edit"
                ? "Make your changes and save to update the module"
                : "Fill in the module details to create engaging learning content"}
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
                {/* Module Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Layers className="h-5 w-5 text-purple-400" />
                        Module Title
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter module title (e.g., Variables and Data Types)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Module Content Field */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <FileText className="h-5 w-5 text-blue-400" />
                        Module Content
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Write your module content here. Explain concepts clearly, provide context, and guide students through the learning process..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300 min-h-[150px] resize-y"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Code Example Field */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Code2 className="h-5 w-5 text-emerald-400" />
                        Code Example
                        <span className="text-white/50 text-sm font-normal ml-2">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Enter code examples, snippets, or exercises here..."
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-gray-900/30 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-gray-900/50 focus:border-white/40 transition-all duration-300 min-h-[200px] resize-y font-mono text-sm"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Tip:</strong>{" "}
                          Include well-commented code examples that students can
                          understand and experiment with. Make sure your code is
                          tested and functional.
                        </p>
                      </div>
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

                {/* Module Objectives */}
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
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Tip:</strong> Clear
                          objectives help students understand what they will
                          learn and achieve by the end of the module.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Duration Field */}
                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Estimated Duration (minutes)
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

                {/* Programming Language Field */}
                <FormField
                  control={form.control}
                  name="languageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Globe className="h-5 w-5 text-yellow-400" />
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
                            ? "Updating Module..."
                            : "Creating Module..."}
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
                      ? "Changes will be immediately visible to all students enrolled in this lesson"
                      : "Once created, students will be able to access this module as part of their learning journey"}
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module Guidelines */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Module Guidelines
            </h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Keep modules focused on a single concept</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include practical, runnable code examples</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Explain the 'why' behind concepts</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>End with a clear summary</span>
              </li>
            </ul>
          </div>

          {/* Content Tips */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Content Tips
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-3 w-3 text-emerald-400" />
                  <span className="text-white font-medium text-xs">
                    Clarity
                  </span>
                </div>
                <p className="text-white/70 text-xs">
                  Use simple, clear language that beginners can understand
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-3 w-3 text-purple-400" />
                  <span className="text-white font-medium text-xs">
                    Engagement
                  </span>
                </div>
                <p className="text-white/70 text-xs">
                  Include interactive elements and hands-on exercises
                </p>
              </div>
            </div>
          </div>

          {/* Code Best Practices */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
              <Code2 className="h-5 w-5 text-emerald-400" />
              Code Best Practices
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Add clear comments explaining complex logic</li>
              <li>• Use meaningful variable and function names</li>
              <li>• Keep examples concise and focused</li>
              <li>• Test all code before publishing</li>
              <li>• Include expected outputs for examples</li>
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
                  <li>• Review the updated content for accuracy</li>
                  <li>• Test any code changes thoroughly</li>
                  <li>• Consider notifying students of updates</li>
                </>
              ) : (
                <>
                  <li>• Preview your module before publishing</li>
                  <li>• Create additional modules for the lesson</li>
                  <li>• Add quizzes to test understanding</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCreateForm;
