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
