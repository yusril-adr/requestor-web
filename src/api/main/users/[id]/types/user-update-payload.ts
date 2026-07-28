import type { TUserCreatePayload } from "@/api/main/users/types/user-create-payload";
import type { UserStatusEnum } from "@/api/main/users/enums/user-status";

export type TUserUpdatePayload = Partial<TUserCreatePayload> & {
  status?: UserStatusEnum;
};
