import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Outlet } from "react-router";
import { Separator } from "../ui/separator";
import { Suspense } from "react";
import Loading from "@/containers/loading/loading";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <Suspense fallback={<Loading />}>
          <main>
            <Outlet />
          </main>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}
