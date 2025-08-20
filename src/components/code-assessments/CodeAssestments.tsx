import { routes } from "@/static-data/routes";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { deleteCodeAssessment } from "@/services/code-assesment";
import { codeAssessmentKeys } from "@/tanstack/keys/code-assesment";

const CodeAssessments = () => {
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId: string;
  }>();
  const navigate = useNavigate();

  const handleEditCodeAssessment = () => {
    navigate(routes.CODE_ASSESSMENT_EDIT(courseId, codeAssessmentId));
  };

  const { mutate: deleteCodeAssessmentMutation } = useMutation({
    mutationKey: codeAssessmentKeys.delete(courseId, codeAssessmentId),
    mutationFn: async () => {
      return deleteCodeAssessment(axiosInstance, {
        courseId,
        id: codeAssessmentId,
      });
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Code Assessment deleted successfully",
      invalidatesQueries: codeAssessmentKeys.all(courseId),
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Code Assessment</h1>
      <div className="flex mb-4">
        <Button
          onClick={handleEditCodeAssessment}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteCodeAssessmentMutation()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Delete
        </Button>
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
          onClick={() =>
            navigate(routes.TEST_CASE_CREATE(courseId, codeAssessmentId))
          }
        >
          Add Test Case
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default CodeAssessments;
