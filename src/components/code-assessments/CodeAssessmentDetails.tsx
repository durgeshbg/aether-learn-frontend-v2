import type { TestCase } from "@/types/TestCase";
import type { CodeAssesment } from "@/types/CodeAssesment";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { testCaseKeys } from "@/tanstack/keys/test-case";
import { getCodeAssessmentById } from "@/services/code-assesment";
import { getTestCases } from "@/services/test-case";
import { AdminCodeAssessmentView } from "./AdminCodeAssessmentView";
import { StudentCodeAssessmentView } from "./StudentCodeAssessmentView";

const CodeAssessmentDetails = () => {
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId: string;
  }>();
  const { user } = useAuth();

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
    select: (data: { testCases: TestCase[] }) => data?.testCases || [],
  });

  // Determine if user is admin/instructor
  const isAdmin = user?.role === "ADMIN";

  if (isAdmin) {
    return (
      <AdminCodeAssessmentView
        codeAssessment={codeAssessment}
        testCases={testCases}
        courseId={courseId}
        codeAssessmentId={codeAssessmentId}
      />
    );
  }

  return (
    <StudentCodeAssessmentView
      codeAssessment={codeAssessment}
      testCases={testCases}
      courseId={courseId}
      codeAssessmentId={codeAssessmentId}
    />
  );
};

export default CodeAssessmentDetails;
