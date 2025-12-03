import type { RouteObject } from "react-router";
import LoginForm from "@/components/forms/login.tsx";

export const publicRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginForm />,
  },
];

