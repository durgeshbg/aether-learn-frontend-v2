import type {
  UserCreateType,
  UserIdParamsType,
  UserLogin,
  UserNameUpdateType,
  UserOrganizationUpdateType,
  UserRoleUpdateType,
} from '@/types/User';
import type { AxiosInstance } from 'axios';

export const login = async (axiosInstance: AxiosInstance, data: UserLogin) => {
  const response = await axiosInstance.post('/users/login', data);
  return response.data;
};

export const getUsers = async (axiosInstance: AxiosInstance) => {
  const response = await axiosInstance.get('/users');
  return response.data;
};

export const createUser = async (
  axiosInstance: AxiosInstance,
  data: UserCreateType
) => {
  const response = await axiosInstance.post('/users', data);
  return response.data;
};

export const getUsersInOrganization = async (axiosInstance: AxiosInstance) => {
  const response = await axiosInstance.get('/users/organization');
  return response.data;
};

export const getUserInOrganization = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamsType
) => {
  const response = await axiosInstance.get(
    `/users/organization/${params.userId}`
  );
  return response.data;
};

export const getUserById = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamsType
) => {
  const response = await axiosInstance.get(`/users/${params.userId}`);
  return response.data;
};

export const upadteUserName = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamsType,
  data: UserNameUpdateType
) => {
  const response = await axiosInstance.put(`/users/${params.userId}`, data);
  return response.data;
};

export const updateUserOrganization = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamsType,
  data: UserOrganizationUpdateType
) => {
  const response = await axiosInstance.put(
    `/users/${params.userId}/organization`,
    data
  );
  return response.data;
};

export const updateUserOrganizationAdmin = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamsType,
  data: UserOrganizationUpdateType
) => {
  const response = await axiosInstance.put(
    `/users/${params.userId}/organization-admin`,
    data
  );
  return response.data;
};

export const updateUserRole = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamsType,
  data: UserRoleUpdateType
) => {
  const response = await axiosInstance.put(
    `/users/${params.userId}/role`,
    data
  );
  return response.data;
};

export const deleteUser = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamsType
) => {
  const response = await axiosInstance.delete(`/users/${params.userId}`);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
