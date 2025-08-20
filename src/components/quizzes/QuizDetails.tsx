import { deleteQuestion, getQuestions } from "@/services/question";
import { getQuiz } from "@/services/quiz";
import { questionKeys } from "@/tanstack/keys/question";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import type { Question } from "@/types/Question";
import type { Quiz } from "@/types/Quiz";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { routes } from "@/static-data/routes";

const QuizDetails = () => {
  const { courseId = "", quizId = "" } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data: { quiz: Quiz }) => data.quiz,
  });

  const { data: questions } = useSuspenseQuery({
    queryKey: questionKeys.all(courseId, quizId),
    queryFn: async () => {
      return getQuestions(axiosInstance, { courseId, quizId });
    },
    select: (data: { questions: Question[] }) => data?.questions,
  });

  const { mutate: deleteQuestionMutation } = useMutation({
    mutationKey: questionKeys.delete(courseId, quizId, "delete"),
    mutationFn: async (questionId: string) => {
      return deleteQuestion(axiosInstance, {
        courseId,
        quizId,
        id: questionId,
      });
    },
    meta: {
      notify: true,
      successMessage: "Question deleted successfully",
      invalidatesQueries: questionKeys.all(courseId, quizId),
    },
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Details</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Title</h2>
        <p>{quiz.title}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p>{quiz.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Questions</h2>
        <ul>
          {questions?.length === 0 && (
            <li className="mb-2">No questions available</li>
          )}
          {questions?.map((question) => (
            <li key={question.id} className="mb-2">
              <p className="font-medium">{question.text}</p>
              <ul className="list-decimal pl-5">
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">
                Correct Answer: {question.answer}
              </p>
              <div className="flex space-x-2 mt-2">
                <Button
                  onClick={() =>
                    navigate(
                      routes.QUESTION_EDIT(courseId, quizId, question.id),
                    )
                  }
                >
                  Edit Question
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteQuestionMutation(question.id)}
                >
                  Delete Question
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizDetails;
