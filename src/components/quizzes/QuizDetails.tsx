import { useAuth } from "@/hooks/useAuth";
import { useParams } from "react-router";
import { AdminQuizDetails } from "./AdminQuizDetails";
import { UserQuizExperience } from "./UserQuizExperience";

const QuizDetails = () => {
  const { user } = useAuth();
  const { courseId = "", quizId = "" } = useParams<{
    courseId: string;
    quizId: string;
  }>();

  // Determine if user is admin (adjust this logic based on your auth system)
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="w-full min-h-screen">
      {isAdmin ? (
        <AdminQuizDetails courseId={courseId} quizId={quizId} />
      ) : (
        <UserQuizExperience courseId={courseId} quizId={quizId} />
      )}
    </div>
  );
};

export default QuizDetails;
