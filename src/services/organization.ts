import { apiRoutes } from '@/static-data/routes';
import type {
  OrgAdminUpdateType,
  OrganizationCourseUpdateType,
  OrganizationCreateType,
  OrganizationIdParamType,
  OrganizationUpdateType,
  OrganizationUserUpdateType,
} from '@/types/Organization';
import type { AxiosInstance } from 'axios';

export const getOrganizations = async (axiosInstance: AxiosInstance) => {
  const response = await axiosInstance.get(apiRoutes.ORGANIZATIONS);
  return response.data;
};

export const creatOrganization = async (
  axiosInstance: AxiosInstance,
  data: OrganizationCreateType
) => {
  const response = await axiosInstance.post(apiRoutes.ORGANIZATIONS, data);
  return response.data;
};

export const searchOrganizations = async (
  axiosInstance: AxiosInstance,
  query: {
    name: string;
  }
) => {
  const response = await axiosInstance.get(
    apiRoutes.ORGANIZATIONS_SEARCH(query.name)
  );
  return response.data;
};

export const getOrganizationById = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType
) => {
  const response = await axiosInstance.get(
    `${apiRoutes.ORGANIZATION_ID(params.id)}`
  );
  return response.data;
};

export const updateOrganization = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType,
  data: OrganizationUpdateType
) => {
  const response = await axiosInstance.put(
    `${apiRoutes.ORGANIZATION_ID(params.id)}`,
    data
  );
  return response.data;
};

export const deleteOrganization = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType
) => {
  const response = await axiosInstance.delete(
    `${apiRoutes.ORGANIZATION_ID(params.id)}`
  );
  return response.data;
};

export const updateOrganizationAdmin = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType,
  data: OrgAdminUpdateType
) => {
  const response = await axiosInstance.put(
    `${apiRoutes.ORGANIZATION_ID_ORG_ADMIN(params.id)}`,
    data
  );
  return response.data;
};

//Users
export const getOrganizationUsers = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType
) => {
  const response = await axiosInstance.get(
    `${apiRoutes.ORGANIZATION_ID_USERS(params.id)}`
  );
  return response.data;
};

export const addOrganizationUsers = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType,
  data: OrganizationUserUpdateType
) => {
  const response = await axiosInstance.put(
    `${apiRoutes.ORGANIZATION_ID_USERS(params.id)}`,
    data
  );
  return response.data;
};

export const removeOrganizationUsers = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType,
  data: OrganizationUserUpdateType
) => {
  const response = await axiosInstance.delete(
    `${apiRoutes.ORGANIZATION_ID_USERS(params.id)}`,
    { data }
  );
  return response.data;
};

// Courses

export const getOrganizationCourses = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType
) => {
  const response = await axiosInstance.get(
    `${apiRoutes.ORGANIZATION_ID_COURSES(params.id)}`
  );
  return response.data;
};

export const addOrganizationCourses = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType,
  data: OrganizationCourseUpdateType
) => {
  const response = await axiosInstance.put(
    `${apiRoutes.ORGANIZATION_ID_COURSES(params.id)}`,
    data
  );
  return response.data;
};

export const removeOrganizationCourses = async (
  axiosInstance: AxiosInstance,
  params: OrganizationIdParamType,
  data: OrganizationCourseUpdateType
) => {
  const response = await axiosInstance.delete(
    `${apiRoutes.ORGANIZATION_ID_COURSES(params.id)}`,
    { data }
  );
  return response.data;
};
