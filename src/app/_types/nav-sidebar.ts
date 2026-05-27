import type { RoleKeyEnum } from "@/api/requestor/users/enums/role-key";
import type { LucideIcon } from "lucide-react";

export type TNavSidebar = {
  title: string;
  icon: LucideIcon;
  path: string;
  authorizedRoles?: RoleKeyEnum[];
};
