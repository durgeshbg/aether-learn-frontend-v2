import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import ProtectedRoutes from "../containers/Routes/ProtectedRoutes.tsx";
import ProtectedRoutesWrapper from "../components/ProtectedRoutesWrapper/ProtectedRoutesWrapper.tsx";
import OrgAdminRoutes from "../containers/Routes/OrgAdminRoutes.tsx";
import AdminRoutes from "../containers/Routes/AdminRoutes.tsx";
import Error from "../containers/error/error.tsx";
import { publicRoutes } from "./routes/publicRoutes.tsx";
import { userRoutes } from "./routes/userRoutes.tsx";
import { orgAdminRoutes } from "./routes/orgAdminRoutes.tsx";
import { adminRoutes } from "./routes/adminRoutes.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...publicRoutes,
      {
        path: "/",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/",
            element: <ProtectedRoutesWrapper />,
            children: [
              ...userRoutes,
              {
                path: "/",
                element: <OrgAdminRoutes />,
                children: orgAdminRoutes,
              },
              {
                path: "/",
                element: <AdminRoutes />,
                children: adminRoutes,
              },
            ],
          },
        ],
      },
    ],
    errorElement: <Error />,
  },
]);

export default router;
