import { routes } from "@/static-data/routes";
import { Navigate, Outlet } from "react-router";
import Loading from "../loading/loading";
import { useAuth } from "@/hooks/useAuth";

const OrgAdminRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isOrgAdmin =
    user?.orgAdminOf && user?.organization?.id === user?.orgAdminOf?.id;

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  if (!(isAdmin || isOrgAdmin)) {
    return <Navigate to={routes.HOME} replace />;
  }

  return <Outlet />;
};

export default OrgAdminRoutes;
