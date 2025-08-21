import { Outlet } from "react-router";
import { Suspense } from "react";
import Loading from "@/containers/loading/loading";
import { GlassmorphicNavbar } from "../navbar/GlassmorphicNavbar";

function ProtectedRoutesWrapper() {
  return (
    <>
      <GlassmorphicNavbar />
      <Suspense fallback={<Loading />}>
        <main className="px-20 py-8">
          <Outlet />
        </main>
      </Suspense>
    </>
  );
}
export default ProtectedRoutesWrapper;
