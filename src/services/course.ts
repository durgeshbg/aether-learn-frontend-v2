import { apiRoutes } from "@/static-data/routes";
import type {
  CourseCreateType,
  CourseFeebacks,
  CourseFeedbackType,
  CourseIdParamType,
  CourseOrganizationIDQueryRequiredType,
  CourseOrganizationIDQueryType,
  CourseUpdateType,
} from "@/types/Course";
import type { AxiosInstance } from "axios";

export const getCourses = async (
  axiosInstance: AxiosInstance,
  query: CourseOrganizationIDQueryType,
) => {
  const response = await axiosInstance.get(apiRoutes.COURSES, {
    params: query,
  });
  return response.data;
};

export const getNonOrganizationCourses = async (
  axiosInstance: AxiosInstance,
  query: CourseOrganizationIDQueryRequiredType,
) => {
  const response = await axiosInstance.get(apiRoutes.COURSES_NON_ORGANIZATION, {
    params: query,
  });
  return response.data;
};

export const createCourse = async (
  axiosInstance: AxiosInstance,
  data: CourseCreateType,
) => {
  const response = await axiosInstance.post(apiRoutes.COURSES, data);
  return response.data;
};

export const createCourseFeedback = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType,
  data: CourseFeedbackType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.COURSE_FEEDBACK(params.id),
    data,
  );
  return response.data;
};

export const getCourseFeedbacks = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.COURSE_FEEDBACK(params.id),
  );
  return response.data as CourseFeebacks;
};

export const getCourseById = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType,
) => {
  const response = await axiosInstance.get(apiRoutes.COURSE_ID(params.id));
  return response.data;
};

export const updateCourse = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType,
  data: CourseUpdateType,
) => {
  const response = await axiosInstance.put(
    apiRoutes.COURSE_ID(params.id),
    data,
  );
  return response.data;
};

export const deleteCourse = async (
  axiosInstance: AxiosInstance,
  params: CourseIdParamType,
) => {
  const response = await axiosInstance.delete(apiRoutes.COURSE_ID(params.id));
  return response.data;
};
