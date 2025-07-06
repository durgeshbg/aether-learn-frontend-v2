export type Role = 'ADMIN' | 'USER';

export type UserLogin = {
  email: string;
  password: string;
};

export type UserCreateType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationId?: string;
  orgAdmin?: boolean;
  role?: Role;
};

export type UserNameUpdateType = {
  firstName: string;
  lastName: string;
};

export type UserOrganizationUpdateType = {
  organizationId: string;
};

export type UserRoleUpdateType = {
  role: Role;
};

export type UserIdParamsType = {
  userId: string;
};
