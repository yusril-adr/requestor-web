import type { TRequestorApiPaginationPayload } from "@/api/requestor/types/pagination-payload";
import type { TRequestSortBy } from "@/api/requestor/requests/consts/request-sort-by";
import type { RoleKeyEnum } from "@/common/enums/role-key";
import type { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";

export type TRequestPaginationPayload = TRequestorApiPaginationPayload & {
  sort_by?: TRequestSortBy;
  priority?: RoleKeyEnum;
  status?: RequestStatusEnum;
};
