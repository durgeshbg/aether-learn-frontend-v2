import { getQuestions } from "@/services/question";
import { getQuiz } from "@/services/quiz";
import { questionKeys } from "@/tanstack/keys/question";
import { quizKeys } from "@/tanstack/keys/quizKeys";
import type { Question } from "@/types/Question";
import type { Quiz } from "@/types/Quiz";
import { axiosInstance } from "@/utils/axiosInstance";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { AdminQuizView } from "./AdminQuizView";
import { StudentQuizView } from "./StudentQuizView";

const QuizDetails = () => {
  const { courseId = "", quizId = "" } = useParams<{
    courseId: string;
    quizId: string;
  }>();
  const { user } = useAuth();

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
    select: (data: { questions: Question[] }) => data?.questions || [],
  });

  // Determine if user is admin/instructor
  const isAdmin = user?.role === "ADMIN";

  if (isAdmin) {
    return (
      <AdminQuizView
        quiz={quiz}
        questions={questions}
        courseId={courseId}
        quizId={quizId}
      />
    );
  }

  return (
    <StudentQuizView
      quiz={quiz}
      questions={questions}
      courseId={courseId}
      quizId={quizId}
    />
  );
};

export default QuizDetails;
