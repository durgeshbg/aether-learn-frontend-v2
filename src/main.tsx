import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';
import App from './App.tsx';
import { LoginForm } from './components/forms/login.tsx';
import { QueryClientProvider } from './providers/QueryClientProvider.tsx';
import ProtectedRoutes from './containers/Routes/ProtectedRoutes.tsx';
import AuthProvider from './providers/AuthProvider.tsx';

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
        children: [{ path: 'dashboard', element: <div>Dashboard</div> }],
      },
    ],
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
