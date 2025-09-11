import { apiRoutes } from "@/static-data/routes";
import type {
  LessonCourseIdParamsType,
  LessonIdParamsType,
  DBLessonCreateType,
  DBLessonUpdateType,
  Lesson,
} from "@/types/Lesson";
import type { AxiosInstance } from "axios";

export const getLessons = async (
  axiosInstance: AxiosInstance,
  params: LessonCourseIdParamsType,
) => {
  const response = await axiosInstance.get(apiRoutes.LESSONS(params.courseId));
  return response.data as { lessons: Lesson[] };
};

export const createLesson = async (
  axiosInstance: AxiosInstance,
  params: LessonCourseIdParamsType,
  data: DBLessonCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.LESSONS(params.courseId),
    data,
  );
  return response.data;
};

export const getLessonById = async (
  axiosInstance: AxiosInstance,
  params: LessonIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.LESSON_ID(params.courseId, params.id),
  );
  return response.data as { lesson: Lesson };
};

export const updateLesson = async (
  axiosInstance: AxiosInstance,
  params: LessonIdParamsType,
  data: DBLessonUpdateType,
) => {
  const response = await axiosInstance.put(
    apiRoutes.LESSON_ID(params.courseId, params.id),
    data,
  );
  return response.data;
};

export const deleteLesson = async (
  axiosInstance: AxiosInstance,
  params: LessonIdParamsType,
) => {
  const response = await axiosInstance.delete(
    apiRoutes.LESSON_ID(params.courseId, params.id),
  );
  return response.data;
};
