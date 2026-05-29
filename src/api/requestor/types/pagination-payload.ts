import type { OrderKeyEnum } from "@/common/enums/order-key";

export type TRequestorApiPaginationPayload = {
  search?: string;
  page: number;
  per_page?: number;
  sort_by?: string;
  order?: OrderKeyEnum;
};
