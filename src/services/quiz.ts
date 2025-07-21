import { apiRoutes } from '@/static-data/routes';
import type {
  QuizCourseIdParamsType,
  QuizCreateType,
  QuizIdParamsType,
  QuizUpdateType,
} from '@/types/Quiz';
import type { AxiosInstance } from 'axios';

export const getQuizzez = async (
  axiosInstance: AxiosInstance,
  params: QuizCourseIdParamsType
) => {
  return axiosInstance.get(apiRoutes.QUIZZES(params.courseId));
};

export const createQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizCourseIdParamsType,
  data: QuizCreateType
) => {
  return axiosInstance.post(apiRoutes.QUIZZES(params.courseId), data);
};

export const getQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizIdParamsType
) => {
  return axiosInstance.get(apiRoutes.QUIZ_ID(params.courseId, params.id));
};

export const updateQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizIdParamsType,
  data: QuizUpdateType
) => {
  return axiosInstance.put(apiRoutes.QUIZ_ID(params.courseId, params.id), data);
};

export const deleteQuiz = async (
  axiosInstance: AxiosInstance,
  params: QuizIdParamsType
) => {
  return axiosInstance.delete(apiRoutes.QUIZ_ID(params.courseId, params.id));
};
