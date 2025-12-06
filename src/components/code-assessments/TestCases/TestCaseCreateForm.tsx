import { useNavigate, useParams } from "react-router";
import { getTestCaseFormData, type TestCaseFormType } from "../constants";
import { TestCaseCreateSchema, TestCaseUpdateSchema } from "@/types/TestCase";
import { routes } from "@/static-data/routes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { createTestCase, updateTestCase } from "@/services/test-case";
import { testCaseKeys } from "@/tanstack/keys/test-case";
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
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Save, ArrowLeft, Eye } from "lucide-react";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { getCodeAssessmentById } from "@/services/code-assesment";

const TestCaseCreateForm = ({ type = "create" }: TestCaseFormType) => {
  const { title, buttonText, description, icon, formatExamples } =
    getTestCaseFormData(type);
  const {
    courseId = "",
    codeAssessmentId = "",
    testCaseId = "",
  } = useParams<{
    courseId: string;
    codeAssessmentId: string;
    testCaseId: string;
  }>();
  const navigate = useNavigate();

  const { data: testCase } = useSuspenseQuery({
    queryKey: codeAssessmentKeys.getById(courseId, codeAssessmentId),
    queryFn: async () => {
      return type === "edit"
        ? getCodeAssessmentById(axiosInstance, {
            courseId,
            id: codeAssessmentId,
          })
        : null;
    },
    select: (data) =>
      data?.codeAssessment?.testCases?.find((t) => t.id === testCaseId) || null,
  });

  const form = useForm<z.infer<typeof TestCaseCreateSchema>>({
    resolver: zodResolver(TestCaseCreateSchema),
    defaultValues:
      type === "edit" && testCase
        ? {
            description: testCase.description,
            input: testCase.input,
            expected: testCase.expected,
            weight: testCase.weight,
          }
        : {},
  });

  const { mutate: createTestCaseMutation, isPending: isCreating } = useMutation(
    {
      mutationKey: testCaseKeys.create(courseId, codeAssessmentId),
      mutationFn: async (data: z.infer<typeof TestCaseCreateSchema>) => {
        return createTestCase(
          axiosInstance,
          { courseId, codeAssessmentId },
          data
        );
      },
      onSuccess: () => {
        navigate(routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId));
      },
      meta: {
        notify: true,
        successMessage: "Test Case created successfully",
        invalidatesQueries: testCaseKeys.all(courseId, codeAssessmentId),
      },
    }
  );

  const { mutate: updateTestCaseMutation, isPending: isUpdating } = useMutation(
    {
      mutationKey: testCaseKeys.update(courseId, codeAssessmentId, testCaseId),
      mutationFn: async (data: z.infer<typeof TestCaseUpdateSchema>) => {
        return updateTestCase(
          axiosInstance,
          { courseId, codeAssessmentId, id: testCaseId },
          data
        );
      },
      onSuccess: () => {
        navigate(routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId));
      },
      meta: {
        notify: true,
        successMessage: "Test Case updated successfully",
        invalidatesQueries: testCaseKeys.all(courseId, codeAssessmentId),
      },
    }
  );

  const onSubmit = (data: z.infer<typeof TestCaseCreateSchema>) => {
    if (type === "create") {
      createTestCaseMutation(data);
    } else {
      updateTestCaseMutation(data);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  // Watch form values for preview
  const watchedValues = form.watch();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate(routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId))
        }
        className="inline-flex w-fit items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to assessment
      </Button>

      <Card>
        <CardHeader className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-3xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Test case details</CardTitle>
            <CardDescription>
              Define inputs, expectations, and weights for this scenario.
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test case description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Basic functionality test, edge case, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input data</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="[1,2,3] or newline-separated params"
                          className="font-mono text-sm"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected output</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Expected output, e.g. [2,4,6]"
                          className="font-mono text-sm"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
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
                      <span>
                        {type === "edit"
                          ? "Updating test case..."
                          : "Creating test case..."}
                      </span>
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
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Eye className="h-4 w-4" />
                Live preview
              </CardTitle>
              <CardDescription>
                Mirrors exactly how this case will be stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  Description
                </p>
                <p className="font-medium text-foreground">
                  {watchedValues.description ||
                    "Test case description will appear here..."}
                </p>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">Input</p>
                <pre className="font-mono text-muted-foreground whitespace-pre-wrap">
                  {watchedValues.input || "Input preview..."}
                </pre>
              </div>
              <div className="rounded-lg border border-border/60 p-4">
                <p className="text-xs uppercase text-muted-foreground">
                  Expected output
                </p>
                <pre className="font-mono text-muted-foreground whitespace-pre-wrap">
                  {watchedValues.expected || "Expected output preview..."}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Format examples
              </CardTitle>
              <CardDescription>
                Quick references for popular input/output styles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {formatExamples.map(({ label, example }) => (
                <div key={label}>
                  <p className="font-medium text-foreground">{label}</p>
                  <code className="block rounded bg-muted px-3 py-2 font-mono text-xs">
                    {example}
                  </code>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestCaseCreateForm;
