import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";
import { getCodeAssessmentById } from "@/services/code-assesment";
import { AdminCodeAssessmentView } from "./AdminCodeAssessmentView";
import { StudentAssessmentView } from "./StudentAssesmentView/StudentAssessmentView";

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
    select: (data) => data.codeAssessment,
  });

  const isAdmin = user?.role === "ADMIN";

  if (isAdmin) {
    return (
      <AdminCodeAssessmentView
        codeAssessment={codeAssessment}
        courseId={courseId}
      />
    );
  }

  return (
    <StudentAssessmentView
      codeAssessment={codeAssessment}
      testCases={codeAssessment.testCases}
    />
  );
};

export default CodeAssessmentDetails;
