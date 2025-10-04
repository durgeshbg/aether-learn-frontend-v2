import { getCourseById } from "@/services/course";
import { routes } from "@/static-data/routes";
import { courseKeys } from "@/tanstack/keys/courseKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

const QuizResultsTab = () => {
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

  const handleQuizClick = (assessmentId: string) => {
    navigate(routes.COURSE_SUBMISSIONS_QUIZ_DETAILS(courseId, assessmentId));
  };

  const handleBackClick = () => {
    navigate(routes.HOME);
  };

  return (
    <div>
      <div>Quiz Results for Course: {course?.name}</div>
      <div>
        <button onClick={handleBackClick}>Back to Home</button>
      </div>
      <div>
        {course.quizzes?.map((quiz) => (
          <div key={quiz.id} onClick={() => handleQuizClick(quiz.id)}>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResultsTab;
