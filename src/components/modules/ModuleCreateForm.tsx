import { useNavigate, useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

import { moduleKeys } from "@/tanstack/keys/moduleKeys";
import { getModuleFormData, languages, type ModuleFormType } from "./constants";
import { createModule, getModuleById, updateModule } from "@/services/module";
import { ModuleCreateSchema, ModuleUpdateSchema } from "@/types/Module";
import { axiosInstance } from "@/utils/axiosInstance";
import { routes } from "@/static-data/routes";
import { difficultyLevels } from "../lessons/constants";

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
  FileText,
  Code2,
  Globe,
  BookOpen,
} from "lucide-react";

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
  const navigate = useNavigate();
  const {
    title,
    buttonText,
    backButtonText,
    icon,
    description,
    guidelines,
    codeBestPractices,
  } = getModuleFormData(type);

  const { data: module } = useSuspenseQuery({
    queryKey: moduleKeys.getById(courseId, lessonId, moduleId),
    queryFn: async () => {
      return type === "edit"
        ? getModuleById(axiosInstance, { courseId, lessonId, id: moduleId })
        : null;
    },
    select: (data) => data?.module,
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
            durationMinutes: module.durationMinutes,
          }
        : {
            languageId: languages[0].value,
          }),
    },
  });

  const { mutate: createModuleMutation, isPending: isCreating } = useMutation({
    mutationKey: moduleKeys.create(courseId, lessonId),
    mutationFn: async (data: z.infer<typeof ModuleCreateSchema>) =>
      createModule(axiosInstance, { courseId, lessonId }, data),
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
    mutationFn: async (data: z.infer<typeof ModuleUpdateSchema>) =>
      updateModule(
        axiosInstance,
        { courseId, lessonId, id: moduleId },
        data,
      ),
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

  const handleBack = () => {
    if (type === "edit") {
      navigate(routes.MODULE_DETAILS(courseId, lessonId, moduleId));
    } else {
      navigate(routes.LESSON_DETAILS(courseId, lessonId));
    }
  };

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
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backButtonText}
      </Button>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <CardDescription>
                {type === "edit" ? "Update module" : "Create module"}
              </CardDescription>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Module content</CardTitle>
            <CardDescription>
              Provide the lesson narrative, code, and supporting metadata.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Layers className="h-4 w-4 text-primary" />
                        Module title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variables and Data Types"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="h-4 w-4 text-primary" />
                        Module content
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain concepts clearly, provide context, and guide students..."
                          className="min-h-[180px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Code2 className="h-4 w-4 text-primary" />
                        Code example (optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter code examples, snippets, or exercises..."
                          className="min-h-[200px] resize-y font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Difficulty level
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
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

                <FormField
                  control={form.control}
                  name="durationMinutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Estimated duration (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languageId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium">
                        <Globe className="h-4 w-4 text-primary" />
                        Programming language
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem
                              key={language.value}
                              value={language.value.toString()}
                            >
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          ? "Updating module..."
                          : "Creating module..."}
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Module guidelines</CardTitle>
              <CardDescription>
                Keep each module focused and outcome-driven.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {guidelines.map((guideline) => (
                  <li key={guideline} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Code best practices</CardTitle>
              <CardDescription>
                Encourage readable and runnable snippets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {codeBestPractices.map((guideline) => (
                  <li key={guideline} className="flex items-start gap-2">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleCreateForm;
