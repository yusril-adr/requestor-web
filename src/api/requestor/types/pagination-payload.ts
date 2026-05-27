import type { OrderKeyEnum } from "@/common/enums/order-key";

export type TRequestorApiPaginationPayload = {
  search?: string;
  page: number;
  perPage: number;
  sortBy?: string;
  order?: OrderKeyEnum;
};
