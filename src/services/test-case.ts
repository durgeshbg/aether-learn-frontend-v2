import { apiRoutes } from '@/static-data/routes';
import type {
  TestCaseCourseCodeAssessmentIdParamsType,
  TestCaseCreateType,
  TestCaseIdParamsType,
  TestCaseUpdateType,
} from '@/types/TestCase';
import type { AxiosInstance } from 'axios';

export const getTestCases = async (
  axiosInstance: AxiosInstance,
  params: TestCaseCourseCodeAssessmentIdParamsType
) => {
  const response = await axiosInstance.get(
    apiRoutes.TEST_CASES(params.courseId, params.codeAssessmentId)
  );
  return response.data;
};

export const createTestCase = async (
  axiosInstance: AxiosInstance,
  params: TestCaseCourseCodeAssessmentIdParamsType,
  data: TestCaseCreateType
) => {
  const response = await axiosInstance.post(
    apiRoutes.TEST_CASES(params.courseId, params.codeAssessmentId),
    data
  );
  return response.data;
};

export const getTestCaseById = async (
  axiosInstance: AxiosInstance,
  params: TestCaseIdParamsType
) => {
  const response = await axiosInstance.get(
    apiRoutes.TEST_CASE_ID(params.courseId, params.codeAssessmentId, params.id)
  );
  return response.data;
};

export const updateTestCase = async (
  axiosInstance: AxiosInstance,
  params: TestCaseIdParamsType,
  data: TestCaseUpdateType
) => {
  const response = await axiosInstance.put(
    apiRoutes.TEST_CASE_ID(params.courseId, params.codeAssessmentId, params.id),
    data
  );
  return response.data;
};

export const deleteTestCase = async (
  axiosInstance: AxiosInstance,
  params: TestCaseIdParamsType
) => {
  const response = await axiosInstance.delete(
    apiRoutes.TEST_CASE_ID(params.courseId, params.codeAssessmentId, params.id)
  );
  return response.data;
};
