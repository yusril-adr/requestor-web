import type { TUserCreatePayload } from "@/api/requestor/users/types/user-create-payload";
import type { UserStatusEnum } from "@/api/requestor/users/enums/user-status";

export type TUserUpdatePayload = Partial<TUserCreatePayload> & {
  status?: UserStatusEnum;
};
