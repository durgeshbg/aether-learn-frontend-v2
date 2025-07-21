import { apiRoutes } from '@/static-data/routes';
import type {
  CourseCreateType,
  CourseIdParamType,
  CourseUpdateType,
} from '@/types/Course';
import type { AxiosInstance } from 'axios';

export const getCourses = async (axiosInstance: AxiosInstance) => {
  const response = await axiosInstance.get(apiRoutes.COURSES);
  return response.data;
};

export const createCourse = async (
  axiosInstance: AxiosInstance,
  data: CourseCreateType
) => {
  const response = await axiosInstance.post(apiRoutes.COURSES, data);
  return response.data;
};

export const getCourseById = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType
) => {
  const response = await axiosInstance.get(apiRoutes.COURSE_ID(params.id));
  return response.data;
};

export const updateCourse = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType,
  data: CourseUpdateType
) => {
  const response = await axiosInstance.put(
    apiRoutes.COURSE_ID(params.id),
    data
  );
  return response.data;
};

export const deleteCourse = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType
) => {
  const response = await axiosInstance.delete(apiRoutes.COURSE_ID(params.id));
  return response.data;
};
