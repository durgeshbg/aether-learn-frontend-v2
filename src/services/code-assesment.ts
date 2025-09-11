import { apiRoutes } from "@/static-data/routes";
import type {
  CodeAssesment,
  CodeAssessmentCourseIdParamsType,
  CodeAssessmentCreateType,
  CodeAssessmentIdParamsType,
  CodeAssessmentUpdateType,
} from "@/types/CodeAssesment";
import type { AxiosInstance } from "axios";

export const getCodeAssessments = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentCourseIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.CODE_ASSESSMENTS(params.courseId),
  );
  return response.data as { codeAssessments: CodeAssesment[] };
};

export const createCodeAssessment = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentCourseIdParamsType,
  data: CodeAssessmentCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.CODE_ASSESSMENTS(params.courseId),
    data,
  );
  return response.data;
};

export const getCodeAssessmentById = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.CODE_ASSESSMENT_ID(params.courseId, params.id),
  );
  return response.data as { codeAssessment: CodeAssesment };
};

export const updateCodeAssessment = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentIdParamsType,
  data: CodeAssessmentUpdateType,
) => {
  const response = await axiosInstance.put(
    apiRoutes.CODE_ASSESSMENT_ID(params.courseId, params.id),
    data,
  );
  return response.data;
};

export const deleteCodeAssessment = async (
  axiosInstance: AxiosInstance,
  params: CodeAssessmentIdParamsType,
) => {
  const response = await axiosInstance.delete(
    apiRoutes.CODE_ASSESSMENT_ID(params.courseId, params.id),
  );
  return response.data;
};
