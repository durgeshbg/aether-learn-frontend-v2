import type { RouteObject } from "react-router";
import Users from "@/components/users/Users.tsx";
import UsersList from "@/components/users/UsersList.tsx";
import AddUserForm from "@/components/forms/add-user/add-user.tsx";
import UserDetails from "@/components/users/UserDetails.tsx";
import Organizations from "@/components/organizations/Organizations.tsx";
import OrganizationDetails from "@/components/organizations/OrganizationDetails/OrganizationDetials.tsx";
import OrganizationEditForm from "@/components/organizations/OrganizationEditForm.tsx";

export const orgAdminRoutes: RouteObject[] = [
  {
    path: "users",
    element: <Users />,
    children: [
      {
        index: true,
        element: <UsersList />,
      },
      {
        path: "create",
        element: <AddUserForm />,
      },
      {
        path: ":userId",
        element: <UserDetails />,
      },
    ],
  },
  {
    path: "organizations",
    element: <Organizations />,
    children: [
      {
        path: ":organizationId",
        element: <OrganizationDetails />,
      },
      {
        path: ":organizationId/edit",
        element: <OrganizationEditForm />,
      },
      {
        path: ":organizationId/edit/admin",
        element: <OrganizationEditForm type="admin" />,
      },
      {
        path: ":organizationId/edit/users",
        element: <OrganizationEditForm type="users" />,
      },
    ],
  },
];

