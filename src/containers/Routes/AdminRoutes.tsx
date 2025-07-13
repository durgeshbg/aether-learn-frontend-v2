import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';

const AdminRoutes = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
