import type { TMainApiPaginationPayload } from "../../types/pagination-payload";
import type { TUserSortBy } from "@/api/main/users/consts/user-sort-by";
import type { RoleKeyEnum } from "@/common/enums/role-key";
import type { UserStatusEnum } from "../enums/user-status";

export type TUserPaginationPayload = TMainApiPaginationPayload & {
  sort_by?: TUserSortBy;
  role?: RoleKeyEnum;
  status?: UserStatusEnum;
};
