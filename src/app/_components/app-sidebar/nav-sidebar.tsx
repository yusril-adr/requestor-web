import { Link, useLocation } from "react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import type { TNavSidebar } from "../../_types/nav-sidebar";

export function NavSidebar({ data }: { data: TNavSidebar[] }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <SidebarGroup>
      {data.map((item) => (
        <SidebarMenu key={item.title}>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={currentPath === item.path}
              className="w-full"
              render={<Link to={item.path} />}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      ))}
    </SidebarGroup>
  );
}
