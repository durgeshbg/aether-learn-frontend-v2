import { apiRoutes } from "@/static-data/routes";
import type {
  Quiz,
  QuizCourseIdParamsType,
  QuizCreateType,
  QuizIdParamsType,
  QuizUpdateType,
} from "@/types/Quiz";
import type { AxiosInstance } from "axios";

export const getQuizzes = async (
  axiosInstance: AxiosInstance,
  params: QuizCourseIdParamsType,
) => {
  const response = await axiosInstance.get(apiRoutes.QUIZZES(params.courseId));
  return response.data as { quizzes: Quiz[] };
};

export const createQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizCourseIdParamsType,
  data: QuizCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.QUIZZES(params.courseId),
    data,
  );
  return response.data;
};

export const getQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.QUIZ_ID(params.courseId, params.id),
  );
  return response.data as { quiz: Quiz };
};

export const updateQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizIdParamsType,
  data: QuizUpdateType,
) => {
  const response = await axiosInstance.put(
    apiRoutes.QUIZ_ID(params.courseId, params.id),
    data,
  );
  return response.data;
};

export const deleteQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizIdParamsType,
) => {
  const response = await axiosInstance.delete(
    apiRoutes.QUIZ_ID(params.courseId, params.id),
  );
  return response.data;
};
