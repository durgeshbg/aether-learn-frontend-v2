import { useNavigate, useParams } from "react-router";
import { getTestCaseFormData, type TestCaseFormType } from "./constants";
import {
  TestCaseCreateSchema,
  TestCaseUpdateSchema,
  type TestCase,
} from "@/types/TestCase";
import { routes } from "@/static-data/routes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  createTestCase,
  getTestCases,
  updateTestCase,
} from "@/services/test-case";
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
import { Button } from "../ui/button";
import {
  Bug,
  Save,
  ArrowLeft,
  Edit3,
  Plus,
  FileText,
  Target,
  Sparkles,
  CheckCircle,
  Terminal,
  Code2,
  Eye,
  AlertTriangle,
} from "lucide-react";

const TestCaseCreateForm = ({ type = "create" }: TestCaseFormType) => {
  const { title, buttonText } = getTestCaseFormData(type);
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
    queryKey: testCaseKeys.all(courseId, codeAssessmentId),
    queryFn: async () => {
      return type === "edit"
        ? getTestCases(axiosInstance, { courseId, codeAssessmentId })
        : null;
    },
    select: (data: { testCases: TestCase[] }) =>
      data?.testCases.find((t) => t.id === testCaseId) || null,
  });

  const form = useForm<z.infer<typeof TestCaseCreateSchema>>({
    resolver: zodResolver(TestCaseCreateSchema),
    defaultValues:
      type === "edit" && testCase
        ? {
            description: testCase.description,
            input: testCase.input,
            expected: testCase.expected,
          }
        : {
            description: "",
            input: "",
            expected: "",
          },
  });

  const { mutate: createTestCaseMutation, isPending: isCreating } = useMutation(
    {
      mutationKey: testCaseKeys.create(courseId, codeAssessmentId),
      mutationFn: async (data: z.infer<typeof TestCaseCreateSchema>) => {
        return createTestCase(
          axiosInstance,
          { courseId, codeAssessmentId },
          data,
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
    },
  );

  const { mutate: updateTestCaseMutation, isPending: isUpdating } = useMutation(
    {
      mutationKey: testCaseKeys.update(courseId, codeAssessmentId, testCaseId),
      mutationFn: async (data: z.infer<typeof TestCaseUpdateSchema>) => {
        return updateTestCase(
          axiosInstance,
          { courseId, codeAssessmentId, id: testCaseId },
          data,
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
    },
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
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <Button
          onClick={() =>
            navigate(routes.CODE_ASSESSMENT_DETAILS(courseId, codeAssessmentId))
          }
          className="mb-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl px-4 py-2 rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessment
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
                  ? "Update test case input and expected output validation"
                  : "Create a test case to validate student code solutions automatically"}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 text-sm">
              {type === "edit"
                ? "Make your changes and save to update the test case"
                : "Define the input and expected output for automatic code validation"}
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
                {/* Test Case Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <FileText className="h-5 w-5 text-blue-400" />
                        Test Case Description
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter test case description (e.g., Basic functionality test, Edge case with empty array)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-white/10 focus:border-white/40 transition-all duration-300"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="text-white/60 text-sm">
                          <strong className="text-white/80">Tip:</strong> Use
                          descriptive names that explain what this test case
                          validates. This helps with debugging and understanding
                          test failures.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Test Input Field */}
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Terminal className="h-5 w-5 text-emerald-400" />
                        Input Data
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Enter the input data for this test case (e.g., [1, 2, 3, 4, 5] or multiple parameters separated by lines)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-gray-900/30 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-gray-900/50 focus:border-white/40 transition-all duration-300 min-h-[120px] resize-y font-mono text-sm"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-400/30">
                        <p className="text-emerald-200 text-sm">
                          <strong>Input Format:</strong> Use the exact format
                          expected by your function. For arrays use [1,2,3], for
                          strings use "hello", for multiple params use separate
                          lines.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Expected Output Field */}
                <FormField
                  control={form.control}
                  name="expected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-white font-semibold text-lg">
                        <Target className="h-5 w-5 text-purple-400" />
                        Expected Output
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Enter the expected output for this input (e.g., [2, 4, 6, 8, 10] or true/false for boolean results)"
                            className="w-full px-4 py-3 text-white placeholder-white/50 bg-gray-900/30 border border-white/20 rounded-xl backdrop-blur-sm focus:bg-gray-900/50 focus:border-white/40 transition-all duration-300 min-h-[120px] resize-y font-mono text-sm"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-sm" />
                      <div className="mt-2 p-3 rounded-lg bg-purple-500/10 border border-purple-400/30">
                        <p className="text-purple-200 text-sm">
                          <strong>Output Format:</strong> Use the exact format
                          your function returns. Match data types precisely -
                          strings need quotes, arrays use brackets, etc.
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
                            ? "Updating Test Case..."
                            : "Creating Test Case..."}
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
                      ? "Changes will be used immediately to validate new student submissions"
                      : "This test case will be used to automatically validate student code solutions"}
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Test Case Preview */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Eye className="h-5 w-5 text-blue-400" />
              Test Case Preview
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-white/70 text-xs mb-1">Description</div>
                <div className="text-white font-medium">
                  {watchedValues.description ||
                    "Test case description will appear here..."}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30">
                <div className="text-emerald-200 text-xs mb-2">INPUT</div>
                <pre className="text-emerald-100 font-mono text-sm whitespace-pre-wrap">
                  {watchedValues.input || "Input data will be shown here..."}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-400/30">
                <div className="text-purple-200 text-xs mb-2">
                  EXPECTED OUTPUT
                </div>
                <pre className="text-purple-100 font-mono text-sm whitespace-pre-wrap">
                  {watchedValues.expected ||
                    "Expected output will be shown here..."}
                </pre>
              </div>
            </div>
          </div>

          {/* Test Case Guidelines */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Bug className="h-5 w-5 text-emerald-400" />
              Test Case Guidelines
            </h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span>Test both normal and edge cases</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <span>Use exact data format matching function signature</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <span>Include boundary value testing</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                <span>Write clear, descriptive test names</span>
              </li>
            </ul>
          </div>

          {/* Common Test Types */}
          <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-2xl border border-white/15 shadow-xl">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <CheckCircle className="h-5 w-5 text-yellow-400" />
              Common Test Types
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white font-medium text-sm mb-1">
                  Basic Functionality
                </div>
                <div className="text-white/70 text-xs">
                  Test core algorithm with typical inputs
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white font-medium text-sm mb-1">
                  Edge Cases
                </div>
                <div className="text-white/70 text-xs">
                  Empty inputs, single elements, boundary values
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white font-medium text-sm mb-1">
                  Error Handling
                </div>
                <div className="text-white/70 text-xs">
                  Invalid inputs, out-of-range values
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white font-medium text-sm mb-1">
                  Performance
                </div>
                <div className="text-white/70 text-xs">
                  Large datasets, time complexity validation
                </div>
              </div>
            </div>
          </div>

          {/* Format Examples */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
              <Code2 className="h-5 w-5 text-purple-400" />
              Format Examples
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-white/80 font-medium">Arrays:</div>
                <code className="text-emerald-400 text-xs">
                  [1, 2, 3, 4, 5]
                </code>
              </div>
              <div>
                <div className="text-white/80 font-medium">Strings:</div>
                <code className="text-blue-400 text-xs">"hello world"</code>
              </div>
              <div>
                <div className="text-white/80 font-medium">Numbers:</div>
                <code className="text-yellow-400 text-xs">42</code>
              </div>
              <div>
                <div className="text-white/80 font-medium">Booleans:</div>
                <code className="text-purple-400 text-xs">true</code>
              </div>
              <div>
                <div className="text-white/80 font-medium">
                  Multiple params:
                </div>
                <code className="text-white/70 text-xs">One per line</code>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="rounded-2xl p-6 bg-yellow-500/10 backdrop-blur-xl border border-yellow-400/30 shadow-lg">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-200 mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-yellow-100 text-sm">
              <li>
                • Data formats must match exactly (spaces, quotes, brackets)
              </li>
              <li>• Test your cases manually before saving</li>
              <li>• Include both passing and failing scenarios</li>
              <li>• Consider performance implications for large inputs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseCreateForm;
