export const routes = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  PROFILE: '/profile',
  USER_CREATE: '/users/create',
};

export const apiRoutes = {
  USERS: '/users',
  USER_LOGIN: '/users/login',
  USERS_ID: (id: string) => `/users/${id}`,
  USER_ID_ORGANIZATION: (id: string) => `/users/${id}/organization`,
  USER_ID_ROLE: (id: string) => `/users/${id}/role`,

};
