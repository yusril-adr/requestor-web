import type { RoleKeyEnum } from "@/common/enums/role-key";

export type TUserMeResponse = {
  id: string;
  name: string;
  email: string;
  role: RoleKeyEnum;
  status: string;
  created_at: string;
  updated_at: string;
};
