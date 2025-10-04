import { getCourseById } from "@/services/course";
import { routes } from "@/static-data/routes";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

const CodeSolutionsTab = () => {
  const navigate = useNavigate();
  const { courseId = "" } = useParams<{
    courseId: string;
  }>();

  const { data: course } = useSuspenseQuery({
    queryKey: courseKeys.getById(courseId),
    queryFn: async () => {
      return getCourseById(axiosInstance, { id: courseId });
    },
    select: (data) => data.course,
  });

  const handleAssessmentClick = (assessmentId: string) => {
    navigate(
      routes.COURSE_SUBMISSIONS_CODE_ASSESSMENT_DETAILS(courseId, assessmentId),
    );
  };

  const handleBackClick = () => {
    navigate(routes.HOME);
  };

  return (
    <div>
      <div>Code Solutions for Course: {course?.name}</div>
      <div>
        <button onClick={handleBackClick}>Back to Home</button>
      </div>
      <div>
        {course.codeAssessments?.map((assessment) => (
          <div
            key={assessment.id}
            onClick={() => handleAssessmentClick(assessment.id)}
          >
            <h3>{assessment.title}</h3>
            <p>{assessment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeSolutionsTab;
