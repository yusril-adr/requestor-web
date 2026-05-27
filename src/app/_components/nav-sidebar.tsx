import { Link, useLocation } from "react-router";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import type { TNavSidebar } from "../_types/nav-sidebar";

export default function NavSidebar({ data }: { data: TNavSidebar[] }) {
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
            >
              <Link to={item.path} className="flex items-center gap-4">
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      ))}
    </SidebarGroup>
  );
}
