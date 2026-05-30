import type { TNavSidebar } from "@/app/_types/nav-sidebar";
import { FileClock, Gauge, Shredder, Users } from "lucide-react";
import { RoleKeyEnum } from "../enums/role-key";

const NAV_ROUTES: TNavSidebar[] = [
  {
    title: "Dashboard",
    icon: Gauge,
    path: "/",
  },
  {
    title: "Users",
    icon: Users,
    path: "/users",
  },
  {
    title: "Requests",
    icon: Shredder,
    path: "/requests",
  },
  {
    title: "Audit Logs",
    icon: FileClock,
    path: "/audit-logs",
    authorizedRoles: [RoleKeyEnum.ADMIN, RoleKeyEnum.OPERATOR],
  },
];

export default NAV_ROUTES;
