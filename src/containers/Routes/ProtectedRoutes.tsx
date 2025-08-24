import { routes } from "@/static-data/routes";
import { Navigate, Outlet } from "react-router";
import Loading from "../loading/loading";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
