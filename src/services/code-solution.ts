import { apiRoutes } from "@/static-data/routes";
import type {
  CodeSolutionAssesmentCourseIdParamsType,
  CodeSolutionCreateType,
  CodeSolutionIdParamsType,
} from "@/types/CodeSolution";
import type { AxiosInstance } from "axios";

export const getCodeSolutions = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionAssesmentCourseIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.CODE_SOLUTIONS(params.courseId, params.codeAssessmentId),
  );
  return response.data;
};

export const createCodeSolution = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionAssesmentCourseIdParamsType,
  data: CodeSolutionCreateType,
) => {
  const response = await axiosInstance.post(
    apiRoutes.CODE_SOLUTIONS(params.courseId, params.codeAssessmentId),
    data,
  );
  return response.data;
};

export const getCodeSolutionById = async (
  axiosInstance: AxiosInstance,
  params: CodeSolutionIdParamsType,
) => {
  const response = await axiosInstance.get(
    apiRoutes.CODE_SOLUTION_ID(
      params.courseId,
      params.codeAssessmentId,
      params.id,
    ),
  );
  return response.data;
};

// export const deleteCodeSolution = async (
//   axiosInstance: AxiosInstance,
//   params: CodeSolutionIdParamsType
// ) => {
//   return axiosInstance.delete(
//     apiRoutes.CODE_SOLUTION_ID(
//       params.courseId,
//       params.codeAssessmentId,
//       params.id
//     )
//   );
// };
