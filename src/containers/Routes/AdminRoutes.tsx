import { routes } from "@/static-data/routes";
import { Navigate, Outlet } from "react-router";
import Loading from "../loading/loading";
import { useAuth } from "@/hooks/useAuth";

const AdminRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to={routes.HOME} replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
