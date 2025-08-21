import { Outlet } from "react-router";
import { Suspense } from "react";
import Loading from "@/containers/loading/loading";
import { GlassmorphicNavbar } from "../navbar/glassmorphic-navbar";

export default function Dashboard() {
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
