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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { Save, ArrowLeft } from "lucide-react";
import { difficultyLevels } from "../lessons/constants";
import { DifficultyLevel } from "@/types/Lesson";
import { LANG_KEYS } from "@/static-data/languages";

const CodeAssessmentCreateForm = ({
  type = "create",
}: CodeAssessmentFormType) => {
  const {
    title,
    buttonText,
    backButtonText,
    icon,
    description,
    guidelines,
    buttonLoadingText,
    estimatedTime,
  } = getCodeAssessmentFormData(type);
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
            runnerCode: assessment.runnerCode,
            languageId:
              parseInt(assessment?.languageId || "") ?? LANG_KEYS.PLAIN_TEXT,
            durationMinutes: assessment.durationMinutes,
            difficulty: assessment.difficulty ?? DifficultyLevel.BEGINNER,
          }
        : {
            languageId: LANG_KEYS.PLAIN_TEXT,
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
          data
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
  const backTarget =
    type === "edit"
      ? routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId)
      : routes.COURSE_DETAILS(courseId);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(backTarget)}
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {backButtonText}
      </Button>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Assessment configuration</CardTitle>
            <CardDescription>
              Provide the prompt, scaffolding, and evaluation details for this
              coding challenge.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Two Sum Algorithm Challenge"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the coding problem, expected inputs, and outputs."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List constraints, examples, and evaluation criteria."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="durationMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input placeholder="30" {...field} />
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
                        <FormLabel>Difficulty</FormLabel>
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
                </div>

                <FormField
                  control={form.control}
                  name="starterCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starter code</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Function signature and helpful comments…"
                          className="min-h-[180px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="runnerCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Runner code</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Code that executes the student's solution and runs test cases."
                          className="min-h-[180px] font-mono text-sm"
                          {...field}
                        />
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
                      <FormLabel>Programming language</FormLabel>
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>{buttonLoadingText}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      <span>{buttonText}</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Assessment guidelines
              </CardTitle>
              <CardDescription>
                Keep challenges consistent and approachable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {guidelines.map((guideline) => (
                  <li key={guideline} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    {guideline}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Time estimates
              </CardTitle>
              <CardDescription>
                Suggested durations per difficulty.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {estimatedTime.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
                >
                  <span className="text-muted-foreground">{item.level}</span>
                  <span className="font-medium text-foreground">
                    {item.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeAssessmentCreateForm;
