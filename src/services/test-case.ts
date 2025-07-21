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
  return axiosInstance.get(
    apiRoutes.TEST_CASES(params.courseId, params.codeAssessmentId)
  );
};

export const createTestCase = async (
  axiosInstance: AxiosInstance,
  params: TestCaseCourseCodeAssessmentIdParamsType,
  data: TestCaseCreateType
) => {
  return axiosInstance.post(
    apiRoutes.TEST_CASES(params.courseId, params.codeAssessmentId),
    data
  );
};

export const getTestCaseById = async (
  axiosInstance: AxiosInstance,
  params: TestCaseIdParamsType
) => {
  return axiosInstance.get(
    apiRoutes.TEST_CASE_ID(params.courseId, params.codeAssessmentId, params.id)
  );
};

export const updateTestCase = async (
  axiosInstance: AxiosInstance,
  params: TestCaseIdParamsType,
  data: TestCaseUpdateType
) => {
  return axiosInstance.put(
    apiRoutes.TEST_CASE_ID(params.courseId, params.codeAssessmentId, params.id),
    data
  );
};

export const deleteTestCase = async (
  axiosInstance: AxiosInstance,
  params: TestCaseIdParamsType
) => {
  return axiosInstance.delete(
    apiRoutes.TEST_CASE_ID(params.courseId, params.codeAssessmentId, params.id)
  );
};
