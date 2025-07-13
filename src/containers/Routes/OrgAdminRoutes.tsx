import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';

const OrgAdminRoutes = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user || !user.orgAdmin || user.organizationId === user.orgAdmin.id) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default OrgAdminRoutes;
