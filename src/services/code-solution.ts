import { apiRoutes } from "@/static-data/routes";
import type {
  CodeSolution,
  CodeSolutionAssesmentIdParamType,
  CodeSolutionCreateType,
  CodeSolutionIdParamType,
  CodeSolutionStatus,
} from "@/types/CodeSolution";
import type { AxiosInstance } from "axios";

export const getCodeSolutions = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionAssesmentIdParamType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.CODE_SOLUTIONS(params.courseId, params.codeAssessmentId),
  );
  return response.data as { codeSolutions: CodeSolution[] };
};

export const runCodeSolution = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionAssesmentIdParamType,
  data: CodeSolutionCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.CODE_SOLUTION_RUN(params.courseId, params.codeAssessmentId),
    data,
  );
  return response.data as { codeSolutionId: string; message: string };
};

export const submitCodeSolution = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionAssesmentIdParamType,
  data: CodeSolutionCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.CODE_SOLUTION_SUBMIT(params.courseId, params.codeAssessmentId),
    data,
  );
  return response.data as { codeSolutionId: string; message: string };
};

export const getCodeSolutionById = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionIdParamType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.CODE_SOLUTION_ID(
      params.courseId,
      params.codeAssessmentId,
      params.id,
    ),
  );
  return response.data as { codeSolution: CodeSolution };
};

export const getCodeSolutionStatus = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionIdParamType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.CODE_SOLUTION_STATUS(
      params.courseId,
      params.codeAssessmentId,
      params.id,
    ),
  );
  return response.data as { status: CodeSolutionStatus };
};
