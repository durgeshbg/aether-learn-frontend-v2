import { AuthContext } from '@/context/AuthContext';
import { routes } from '@/static-data/routes';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import Loading from '../loading/loading';

const OrgAdminRoutes = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  if (!user || !user.orgAdmin || user.organizationId === user.orgAdmin.id) {
    return <Navigate to={routes.HOME} replace />;
  }

  return <Outlet />;
};

export default OrgAdminRoutes;
