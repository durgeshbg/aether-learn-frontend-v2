import { apiRoutes } from '@/static-data/routes';
import type {
  CodeAssessmentCourseIdParamsType,
  CodeAssessmentCreateType,
  CodeAssessmentIdParamsType,
  CodeAssessmentUpdateType,
} from '@/types/CodeAssesment';
import type { AxiosInstance } from 'axios';

export const getCodeAssessments = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentCourseIdParamsType
) => {
  return axiosInstance.get(apiRoutes.CODE_ASSESSMENTS(params.courseId));
};

export const createCodeAssessment = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentCourseIdParamsType,
  data: CodeAssessmentCreateType
) => {
  return axiosInstance.post(apiRoutes.CODE_ASSESSMENTS(params.courseId), data);
};

export const getCodeAssessmentById = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentIdParamsType
) => {
  return axiosInstance.get(
    apiRoutes.CODE_ASSESSMENT_ID(params.courseId, params.id)
  );
};

export const updateCodeAssessment = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentIdParamsType,
  data: CodeAssessmentUpdateType
) => {
  return axiosInstance.put(
    apiRoutes.CODE_ASSESSMENT_ID(params.courseId, params.id),
    data
  );
};

export const deleteCodeAssessment = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentIdParamsType
) => {
  return axiosInstance.delete(
    apiRoutes.CODE_ASSESSMENT_ID(params.courseId, params.id)
  );
};
