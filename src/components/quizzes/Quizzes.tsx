import { deleteQuiz } from "@/services/quiz";
import { routes } from "@/static-data/routes";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { Outlet, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";

const Quizzes = () => {
  const { courseId = "", quizId = "" } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();

  const handleEditQuiz = () => {
    navigate(routes.QUIZ_EDIT(courseId, quizId));
  };

  const { mutate: deleteQuizMutation } = useMutation({
    mutationKey: quizKeys.delete(courseId, quizId),
    mutationFn: async () => {
      return deleteQuiz(axiosInstance, { courseId, id: quizId });
    },
    onSuccess: () => {
      navigate(routes.COURSE_DETAILS(courseId));
    },
    meta: {
      notify: true,
      successMessage: "Quiz deleted successfully",
      invalidatesQueries: quizKeys.all(courseId),
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      <div className="flex mb-4">
        <Button
          onClick={handleEditQuiz}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2"
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteQuizMutation()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Delete
        </Button>
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
          onClick={() => navigate(routes.QUESTION_CREATE(courseId, quizId))}
        >
          Add Question
        </Button>
      </div>
      <Outlet />
    </div>
  );
};

export default Quizzes;
