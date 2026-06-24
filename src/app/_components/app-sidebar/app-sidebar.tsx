import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import { BrainCircuit } from "lucide-react";
import { ThemeToggler } from "../theme-toggler";
import type { TNavSidebar } from "../../_types/nav-sidebar";
import { NavSidebar } from "./nav-sidebar";
import NAV_ROUTES from "@/common/constants/navigation-routes";
import { useAuthContext } from "../../_hooks/use-auth-context";
import { AvatarSidebar } from "./avatar-sidebar";

export function AppSidebar() {
  const { auth } = useAuthContext();

  const navItems: TNavSidebar[] = NAV_ROUTES.filter((nav) => {
    if (!nav.authorizedRoles || nav.authorizedRoles?.length === 0) {
      return true;
    }

    return auth?.role && nav.authorizedRoles?.includes(auth.role);
  });

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-between items-center pl-1.5">
              <div className="flex items-center">
                <BrainCircuit className="mr-2" />
                <span className="font-heading text-2xl ">Requestor</span>
              </div>

              <ThemeToggler />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavSidebar data={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <AvatarSidebar />
      </SidebarFooter>
    </Sidebar>
  );
}
