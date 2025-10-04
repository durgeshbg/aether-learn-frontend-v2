import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";

const Submissions = () => {
  const navigate = useNavigate();
  const { courseId = "" } = useParams<{
    courseId: string;
  }>();

  const handleQuizzesClick = () => {
    navigate(routes.COURSE_SUBMISSIONS_QUIZZES(courseId));
  };

  const handleCodeSolutionsClick = () => {
    navigate(routes.COURSE_SUBMISSIONS_CODE_ASSESSMENTS(courseId));
  };

  return (
    <div>
      <div>Submissions Component</div>
      <div>
        <Button onClick={handleQuizzesClick}>View Quizzes</Button>
        <Button onClick={handleCodeSolutionsClick}>View Code Solutions</Button>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Submissions;
