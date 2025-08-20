import type { TestCase } from "@/types/TestCase";
import type { CodeAssesment } from "@/types/CodeAssesment";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { testCaseKeys } from "@/tanstack/keys/test-case";
import { getCodeAssessmentById } from "@/services/code-assesment";
import { getTestCases, deleteTestCase } from "@/services/test-case";
import { LANGUAGES_MAP } from "@/static-data/languages";

const CodeAssessmentDetails = () => {
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId: string;
  }>();
  const navigate = useNavigate();

  const { data: codeAssessment } = useSuspenseQuery({
    queryKey: codeAssessmentKeys.getById(courseId, codeAssessmentId),
    queryFn: async () =>
      getCodeAssessmentById(axiosInstance, {
        courseId,
        id: codeAssessmentId,
      }),
    select: (data: { codeAssessment: CodeAssesment }) => data.codeAssessment,
  });

  const { data: testCases } = useSuspenseQuery({
    queryKey: testCaseKeys.all(courseId, codeAssessmentId),
    queryFn: async () =>
      getTestCases(axiosInstance, {
        courseId,
        codeAssessmentId,
      }),
    select: (data: { testCases: TestCase[] }) => data?.testCases,
  });

  const { mutate: deleteTestCaseMutation } = useMutation({
    mutationKey: testCaseKeys.delete(courseId, codeAssessmentId, "delete"),
    mutationFn: async (testCaseId: string) =>
      deleteTestCase(axiosInstance, {
        courseId,
        codeAssessmentId,
        id: testCaseId,
      }),
    meta: {
      notify: true,
      successMessage: "Test Case deleted successfully",
      invalidatesQueries: testCaseKeys.all(courseId, codeAssessmentId),
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Code Assessment Details</h1>

      {/* Assessment Info */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Title</h2>
        <p>{codeAssessment.title}</p>

        <h2 className="text-xl font-semibold">Description</h2>
        <p>{codeAssessment.description}</p>

        <h2 className="text-xl font-semibold">Instructions</h2>
        <p className="bg-primary-foreground p-3 rounded">
          {codeAssessment.instructions}
        </p>

        <h2 className="text-xl font-semibold">Starter Code</h2>
        <pre className="bg-gray-900 text-white p-3 rounded overflow-x-auto">
          {codeAssessment.starterCode}
        </pre>

        <p className="text-sm text-gray-600">
          <span className="font-medium">Language:</span>{" "}
          <span className="text-primary-500">
            {LANGUAGES_MAP[codeAssessment.languageId]?.label}
          </span>
        </p>

        <p className="text-xs text-gray-500">
          Created: {new Date(codeAssessment.createdAt).toLocaleString()} |
          Updated: {new Date(codeAssessment.updatedAt).toLocaleString()}
        </p>
      </section>

      {/* Test Cases */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Test Cases</h2>
        <ul className="space-y-4">
          {testCases?.length === 0 && (
            <li className="text-gray-500">No test cases available</li>
          )}
          {testCases?.map((testCase) => (
            <li key={testCase.id} className="border p-4 rounded shadow-sm">
              <p className="font-semibold mb-1">{testCase.description}</p>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Input:</span> {testCase.input}
                </p>
                <p>
                  <span className="font-medium">Expected Output:</span>{" "}
                  {testCase.expected}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Created: {new Date(testCase.createdAt).toLocaleString()} |
                Updated: {new Date(testCase.updatedAt).toLocaleString()}
              </p>
              <div className="flex space-x-2 mt-3">
                <Button
                  onClick={() =>
                    navigate(
                      routes.TEST_CASE_EDIT(
                        courseId,
                        codeAssessmentId,
                        testCase.id,
                      ),
                    )
                  }
                >
                  Edit Test Case
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteTestCaseMutation(testCase.id)}
                >
                  Delete Test Case
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CodeAssessmentDetails;
