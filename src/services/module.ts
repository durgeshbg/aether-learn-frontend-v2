import { apiRoutes } from '@/static-data/routes';
import type {
  ModuleCreateType,
  ModuleIdParamsType,
  ModuleLessonCourseIdParamsType,
  ModuleUpdateType,
} from '@/types/Module';
import type { AxiosInstance } from 'axios';

export const getModules = async (
  axiosInstance: AxiosInstance,
  params: ModuleLessonCourseIdParamsType
) => {
  const response = await axiosInstance.get(
    apiRoutes.MODULES(params.courseId, params.lessonId)
  );
  return response.data;
};

export const createModule = async (
  axiosInstance: AxiosInstance,
  params: ModuleLessonCourseIdParamsType,
  data: ModuleCreateType
) => {
  const response = await axiosInstance.post(
    apiRoutes.MODULES(params.courseId, params.lessonId),
    data
  );
  return response.data;
};

export const getModuleById = async (
  axiosInstance: AxiosInstance,
  params: ModuleIdParamsType
) => {
  const response = await axiosInstance.get(
    apiRoutes.MODULE_ID(params.courseId, params.lessonId, params.id)
  );
  return response.data;
};

export const updateModule = async (
  axiosInstance: AxiosInstance,
  params: ModuleIdParamsType,
  data: ModuleUpdateType
) => {
  const response = await axiosInstance.put(
    apiRoutes.MODULE_ID(params.courseId, params.lessonId, params.id),
    data
  );
  return response.data;
};

export const deleteModule = async (
  axiosInstance: AxiosInstance,
  params: ModuleIdParamsType
) => {
  const response = await axiosInstance.delete(
    apiRoutes.MODULE_ID(params.courseId, params.lessonId, params.id)
  );
  return response.data;
};
