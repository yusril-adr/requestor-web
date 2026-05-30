import type { RoleKeyEnum } from "@/common/enums/role-key";

export type TUserCreatePayload = {
  name: string;
  email: string;
  password: string;
  role?: RoleKeyEnum;
};
