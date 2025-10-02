import { Outlet } from "react-router";
import { Suspense, useState } from "react";
import Loading from "@/containers/loading/loading";
import { GlassmorphicNavbar } from "../navbar/GlassmorphicNavbar";

function ProtectedRoutesWrapper() {
  const [hideNavbar, setHideNavbar] = useState(false);
  return (
    <>
      {!hideNavbar && <GlassmorphicNavbar />}
      <Suspense fallback={<Loading />}>
        <main className="px-20 py-8">
          <Outlet context={[setHideNavbar]} />
        </main>
      </Suspense>
    </>
  );
}
export default ProtectedRoutesWrapper;
