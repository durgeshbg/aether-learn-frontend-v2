import { useParams } from "react-router";

const CodeSolutions = () => {
  const { courseId = "", codeAssessmentId = "" } = useParams<{
    courseId: string;
    codeAssessmentId: string;
  }>();

  return (
    <div>
      Code Solutions Component for Course ID: {courseId}, Code Assessment ID:{" "}
      {codeAssessmentId}
    </div>
  );
};

export default CodeSolutions;
