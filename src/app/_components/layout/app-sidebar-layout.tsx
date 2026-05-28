import { Outlet } from "react-router";
import { AppSidebar } from "@/app/_components/app-sidebar/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/app/_components/ui/sidebar";

export default function AppSidebarLayout() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger />

        <Outlet />
      </SidebarInset>
    </>
  );
}
