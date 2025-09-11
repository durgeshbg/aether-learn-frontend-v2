import { apiRoutes } from "@/static-data/routes";
import type {
  QuestionQuizCourseIdParamsType,
  QuestionCreateType,
  QuestionIdParamsType,
  QuestionUpdateType,
  Question,
} from "@/types/Question";
import type { AxiosInstance } from "axios";

export const getQuestions = async (
  axiosInstance: AxiosInstance,
  params: QuestionQuizCourseIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.QUESTIONS(params.courseId, params.quizId),
  );
  return response.data as { questions: Question[] };
};

export const createQuestion = async (
  axiosInstance: AxiosInstance,
  params: QuestionQuizCourseIdParamsType,
  data: QuestionCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.QUESTIONS(params.courseId, params.quizId),
    data,
  );
  return response.data;
};

export const getQuestion = async (
  axiosInstance: AxiosInstance,
  params: QuestionIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.QUESTION_ID(params.courseId, params.quizId, params.id),
  );
  return response.data as { question: Question };
};

export const updateQuestion = async (
  axiosInstance: AxiosInstance,
  params: QuestionIdParamsType,
  data: QuestionUpdateType,
) => {
  const response = await axiosInstance.put(
    apiRoutes.QUESTION_ID(params.courseId, params.quizId, params.id),
    data,
  );
  return response.data;
};

export const deleteQuestion = async (
  axiosInstance: AxiosInstance,
  params: QuestionIdParamsType,
) => {
  const response = await axiosInstance.delete(
    apiRoutes.QUESTION_ID(params.courseId, params.quizId, params.id),
  );
  return response.data;
};
