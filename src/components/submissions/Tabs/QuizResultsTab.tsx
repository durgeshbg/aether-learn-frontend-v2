import CourseQuizzes from "@/components/courses/Sections/CourseQuizzes";
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

  const handleBackClick = () => {
    navigate(routes.HOME);
  };

  return (
    <div className="rounded-2xl p-6 backdrop-blur-2xl border shadow-xl">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
        Quiz Submissions for Course: {course?.name}
      </h2>
      <CourseQuizzes
        quizzesCount={course.quizzesCount}
        quizzes={course.quizzes}
        routeTo={(quizId) =>
          routes.COURSE_SUBMISSIONS_QUIZ_DETAILS(courseId, quizId)
        }
      />
      <div className="mt-4">
        <button
          onClick={handleBackClick}
          className="
            px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default QuizResultsTab;
