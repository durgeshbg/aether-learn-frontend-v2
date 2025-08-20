import { apiRoutes } from "@/static-data/routes";
import type {
  QuizResultCreateType,
  QuizResultIdParamsType,
  QuizResultQuizICoursedParamsType,
} from "@/types/QuizResult";
import type { AxiosInstance } from "axios";

export const getQuizResults = async (
  axiosInstance: AxiosInstance,
  params: QuizResultQuizICoursedParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.QUIZ_RESULTS(params.courseId, params.quizId),
  );
  return response.data;
};
export const createQuizResult = async (
  axiosInstance: AxiosInstance,
  params: QuizResultQuizICoursedParamsType,
  data: QuizResultCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.QUIZ_RESULTS(params.courseId, params.quizId),
    data,
  );
  return response.data;
};
export const getQuizResultById = async (
  axiosInstance: AxiosInstance,
  params: QuizResultIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.QUIZ_RESULT_ID(params.courseId, params.quizId, params.id),
  );
  return response.data;
};

export const deleteQuizResult = async (
  axiosInstance: AxiosInstance,
  params: QuizResultIdParamsType,
) => {
  const response = await axiosInstance.delete(
    apiRoutes.QUIZ_RESULT_ID(params.courseId, params.quizId, params.id),
  );
  return response.data;
};
