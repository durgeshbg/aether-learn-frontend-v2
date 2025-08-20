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
import { Button } from "../ui/button";

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

  const { mutate: createTestCaseMutation } = useMutation({
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
  });

  const { mutate: updateTestCaseMutation } = useMutation({
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
  });

  const onSubmit = (data: z.infer<typeof TestCaseCreateSchema>) => {
    if (type === "create") {
      createTestCaseMutation(data);
    } else {
      updateTestCaseMutation(data);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Form {...form}>
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-md py-12 px-10 border rounded-lg shadow-md"
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter test case description" {...field} />
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
                <FormLabel>Input</FormLabel>
                <FormControl>
                  <Input placeholder="Enter test case input" {...field} />
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
                <FormLabel>Expected Output</FormLabel>
                <FormControl>
                  <Input placeholder="Enter expected output" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{buttonText}</Button>
        </form>
      </Form>
    </div>
  );
};

export default TestCaseCreateForm;
