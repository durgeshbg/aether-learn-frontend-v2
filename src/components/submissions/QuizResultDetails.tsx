import { getQuiz } from "@/services/quiz";
import { getQuizResultById } from "@/services/quiz-result";
import { quizResultKeys } from "@/tanstack/keys/quiz-result";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import QuestionAndOptions from "../quizzes/UserQuizComponents/QuestionAndOptions";

const QuizResultDetails = () => {
  const {
    courseId = "",
    quizId = "",
    quizResultId = "",
  } = useParams<{
    courseId: string;
    quizId: string;
    quizResultId: string;
  }>();

  const { data: quizResult } = useSuspenseQuery({
    queryKey: quizResultKeys.getById(courseId, quizId, quizResultId),
    queryFn: async () => {
      return getQuizResultById(axiosInstance, {
        courseId,
        quizId,
        id: quizResultId,
      });
    },
    select: (data) => data.quizResult,
  });

  const { data: quiz } = useSuspenseQuery({
    queryKey: quizKeys.getById(courseId, quizId),
    queryFn: async () => {
      return getQuiz(axiosInstance, { courseId, id: quizId });
    },
    select: (data) => data?.quiz,
  });

  const getQuestionData = (response: string) => {
    const [questionId, optionIndex, result] = response.split(":");
    const question = quiz?.questions?.find((q) => q.id === questionId);
    return { question, optionIndex, isCorrect: result === "1" };
  };

  return (
    <div>
      <h2>Quiz Submission Details</h2>
      {quizResult ? (
        <div>
          <p>Quiz: {quizResult.quiz.title}</p>
          <p>Score: {quizResult.score}</p>
          <p>Date: {new Date(quizResult.createdAt).toLocaleDateString()}</p>
          <p>Result: {quizResult.passed ? "Passed" : "Failed"}</p>
          <div>
            <h3>Answers:</h3>
            {quizResult?.responses?.map((response, index) => {
              const { question, optionIndex, isCorrect } =
                getQuestionData(response);
              return (
                question &&
                optionIndex && (
                  <QuestionAndOptions
                    key={index}
                    currentQuestion={question}
                    currentQuestionIndex={index}
                    answers={{
                      [question.id]: parseInt(optionIndex),
                    }}
                    isCorrect={isCorrect}
                    readOnly
                  />
                )
              );
            })}
          </div>
        </div>
      ) : (
        <p>No submissions found for this quiz.</p>
      )}
    </div>
  );
};

export default QuizResultDetails;
