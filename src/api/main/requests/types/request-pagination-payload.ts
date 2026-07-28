import type { TMainApiPaginationPayload } from "@/api/main/types/pagination-payload";
import type { TRequestSortBy } from "@/api/main/requests/consts/request-sort-by";
import type { RequestPriorityEnum } from "@/api/main/requests/enums/request-priority";
import type { RequestStatusEnum } from "@/api/main/requests/enums/request-status";

export type TRequestPaginationPayload = TMainApiPaginationPayload & {
  sort_by?: TRequestSortBy;
  priority?: RequestPriorityEnum;
  status?: RequestStatusEnum;
};
