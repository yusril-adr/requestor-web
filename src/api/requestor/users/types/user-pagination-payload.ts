import type { TRequestorApiPaginationPayload } from "../../types/pagination-payload";
import type { TUserSortBy } from "@/api/requestor/users/consts/user-sort-by";
import type { RoleKeyEnum } from "@/common/enums/role-key";
import type { UserStatusEnum } from "../enums/user-status";

export type TUserPaginationPayload = TRequestorApiPaginationPayload & {
  sortBy?: TUserSortBy;
  role?: RoleKeyEnum;
  status?: UserStatusEnum;
};
