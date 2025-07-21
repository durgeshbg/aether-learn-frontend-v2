import { localStorageKeys } from '@/static-data/localStorage';
import { apiRoutes } from '@/static-data/routes';
import type {
  UserCreateType,
  UserDetailsUpdateType,
  UserIdParamType,
  UserLoginType,
  UserOrganizationUpdateType,
  UserRoleUpdateType,
} from '@/types/User';
import type { AxiosInstance } from 'axios';

export const login = async (
  axiosInstance: AxiosInstance,
  data: UserLoginType
) => {
  const response = await axiosInstance.post(apiRoutes.USER_LOGIN, data);
  return response.data;
};

export const getUsers = async (axiosInstance: AxiosInstance) => {
  const response = await axiosInstance.get(apiRoutes.USERS);
  return response.data;
};

export const createUser = async (
  axiosInstance: AxiosInstance,
  data: UserCreateType
) => {
  const response = await axiosInstance.post(apiRoutes.USERS, data);
  return response.data;
};

export const getUserById = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamType
) => {
  const response = await axiosInstance.get(apiRoutes.USERS_ID(params.id));
  return response.data;
};

export const upadteUserDetails = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamType,
  data: UserDetailsUpdateType
) => {
  const response = await axiosInstance.put(apiRoutes.USERS_ID(params.id), data);
  return response.data;
};

export const updateUserOrganization = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamType,
  data: UserOrganizationUpdateType
) => {
  const response = await axiosInstance.put(
    apiRoutes.USER_ID_ORGANIZATION(params.id),
    data
  );
  return response.data;
};

export const updateUserRole = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamType,
  data: UserRoleUpdateType
) => {
  const response = await axiosInstance.put(
    apiRoutes.USER_ID_ROLE(params.id),
    data
  );
  return response.data;
};

export const deleteUser = async (
  axiosInstance: AxiosInstance,
  params: UserIdParamType
) => {
  const response = await axiosInstance.delete(apiRoutes.USERS_ID(params.id));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
};
