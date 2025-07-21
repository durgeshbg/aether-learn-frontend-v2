import { apiRoutes } from '@/static-data/routes';
import type {
  QuestionQuizCourseIdParamsType,
  QuestionCreateType,
  QuestionIdParamsType,
  QuestionUpdateType,
} from '@/types/Question';
import type { AxiosInstance } from 'axios';

export const getQuestions = (
  axiosInstance: AxiosInstance,
  params: QuestionQuizCourseIdParamsType
) => {
  return axiosInstance.get(apiRoutes.QUESTIONS(params.courseId, params.quizId));
};

export const createQuestion = (
  axiosInstance: AxiosInstance,
  params: QuestionQuizCourseIdParamsType,
  data: QuestionCreateType
) => {
  return axiosInstance.post(
    apiRoutes.QUESTIONS(params.courseId, params.quizId),
    data
  );
};

export const getQuestion = (
  axiosInstance: AxiosInstance,
  params: QuestionIdParamsType
) => {
  return axiosInstance.get(
    apiRoutes.QUESTION_ID(params.courseId, params.quizId, params.id)
  );
};

export const updateQuestion = (
  axiosInstance: AxiosInstance,
  params: QuestionIdParamsType,
  data: QuestionUpdateType
) => {
  return axiosInstance.put(
    apiRoutes.QUESTION_ID(params.courseId, params.quizId, params.id),
    data
  );
};

export const deleteQuestion = (
  axiosInstance: AxiosInstance,
  params: QuestionIdParamsType
) => {
  return axiosInstance.delete(
    apiRoutes.QUESTION_ID(params.courseId, params.quizId, params.id)
  );
};
