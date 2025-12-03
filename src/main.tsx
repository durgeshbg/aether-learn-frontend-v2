import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import "./index.css";
import AuthProvider from "./providers/AuthProvider.tsx";
import { QueryClientProvider } from "./providers/QueryClientProvider.tsx";
import router from "./router/router.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
