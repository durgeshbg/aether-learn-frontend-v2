import { apiRoutes } from '@/static-data/routes';
import type {
  QuizResultCreateType,
  QuizResultIdParamsType,
  QuizResultQuizICoursedParamsType,
} from '@/types/QuizResult';
import type { AxiosInstance } from 'axios';

export const getQuizResults = async (
  axiosInstance: AxiosInstance,
  params: QuizResultQuizICoursedParamsType
) => {
  return axiosInstance.get(
    apiRoutes.QUIZ_RESULTS(params.courseId, params.quizId)
  );
};
export const createQuizResult = async (
  axiosInstance: AxiosInstance,
  params: QuizResultQuizICoursedParamsType,
  data: QuizResultCreateType
) => {
  return axiosInstance.post(
    apiRoutes.QUIZ_RESULTS(params.courseId, params.quizId),
    data
  );
};
export const getQuizResultById = async (
  axiosInstance: AxiosInstance,
  params: QuizResultIdParamsType
) => {
  return axiosInstance.get(
    apiRoutes.QUIZ_RESULT_ID(params.courseId, params.quizId, params.id)
  );
};

export const deleteQuizResult = async (
  axiosInstance: AxiosInstance,
  params: QuizResultIdParamsType
) => {
  return axiosInstance.delete(
    apiRoutes.QUIZ_RESULT_ID(params.courseId, params.quizId, params.id)
  );
};
