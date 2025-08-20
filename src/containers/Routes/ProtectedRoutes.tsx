import { AuthContext } from "@/context/AuthContext";
import { routes } from "@/static-data/routes";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import Loading from "../loading/loading";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
