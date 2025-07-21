export const routes = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  PROFILE: '/profile',
  USER_CREATE: '/users/create',
};

export const apiRoutes = {
  // Users
  USERS: '/users',
  USER_LOGIN: '/users/login',
  USERS_ID: (id: string) => `/users/${id}`,
  USER_ID_ORGANIZATION: (id: string) => `/users/${id}/organization`,
  USER_ID_ROLE: (id: string) => `/users/${id}/role`,
  // Organizations
  ORGANIZATIONS: '/organizations',
  ORGANIZATIONS_SEARCH: (name: string) => `/organizations/search?name=${name}`,
  ORGANIZATION_ID: (id: string) => `/organizations/${id}`,
  ORGANIZATION_ID_ORG_ADMIN: (id: string) => `/organizations/${id}/admin`,
  ORGANIZATION_ID_USERS: (id: string) => `/organizations/${id}/users`,
  ORGANIZATION_ID_COURSES: (id: string) => `/organizations/${id}/courses`,
};
