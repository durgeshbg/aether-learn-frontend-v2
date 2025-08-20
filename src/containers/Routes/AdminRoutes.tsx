import { AuthContext } from "@/context/AuthContext";
import { routes } from "@/static-data/routes";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import Loading from "../loading/loading";

const AdminRoutes = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

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
