import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';
import App from './App.tsx';
import LoginForm from './components/forms/login.tsx';
import { QueryClientProvider } from './providers/QueryClientProvider.tsx';
import ProtectedRoutes from './containers/Routes/ProtectedRoutes.tsx';
import AuthProvider from './providers/AuthProvider.tsx';
import Dashboard from './components/dashboard/dashboard.tsx';
import Error from './containers/error/error.tsx';
import Users from './components/users/Users.tsx';
import Profile from './components/users/Profile.tsx';
import UsersList from './components/users/UsersList.tsx';
import AddUserForm from './components/forms/add-user/add-user.tsx';
import EditUserForm from './components/forms/edit-user/edit-user.tsx';
import UserDetails from './components/users/UserDetails.tsx';
import Organizations from './components/organizations/Organizations.tsx';
import OrganizationCreateForm from './components/organizations/OrganizationCreateForm.tsx';
import OrganizationDetials from './components/organizations/OrganizationDetials.tsx';
import OrganizationsList from './components/organizations/OrganizationsList.tsx';
import OrganizationEditForm from './components/organizations/OrganizationEditForm.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: '/',
        element: <ProtectedRoutes />,
        children: [
          {
            path: '/',
            element: <Dashboard />,
            children: [
              {
                path: '/',
                element: <div>Home Content</div>,
              },
              {
                path: 'users',
                element: <Users />,
                children: [
                  {
                    index: true,
                    element: <UsersList />,
                  },
                  {
                    path: 'create',
                    element: <AddUserForm />,
                  },
                  {
                    path: ':userId',
                    element: <UserDetails />,
                  },
                  {
                    path: ':userId/edit',
                    element: <EditUserForm />,
                  },
                  {
                    path: ':userId/edit/role',
                    element: <EditUserForm type='role' />,
                  },
                  {
                    path: ':userId/edit/organization',
                    element: <EditUserForm type='organization' />,
                  },
                ],
              },
              {
                path: 'organizations',
                element: <Organizations />,
                children: [
                  {
                    index: true,
                    element: <OrganizationsList />,
                  },
                  {
                    path: 'create',
                    element: <OrganizationCreateForm />,
                  },
                  {
                    path: ':organizationId',
                    element: <OrganizationDetials />,
                  },
                  {
                    path: ':organizationId/edit',
                    element: <OrganizationEditForm />,
                  },
                  {
                    path: ':organizationId/edit/admin',
                    element: <OrganizationEditForm type='admin' />,
                  },
                  {
                    path: ':organizationId/edit/users',
                    element: <OrganizationEditForm type='users' />,
                  },
                  {
                    path: ':organizationId/edit/courses',
                    element: <OrganizationEditForm type='courses' />,
                  },
                ],
              },
              {
                path: 'profile',
                element: <Profile />,
              },
            ],
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
