import type { OrderKeyEnum } from "@/common/enums/order-key";

export type TTableQuery = {
  page: number;
  pageSize: number;
  sortBy?: string;
  order?: OrderKeyEnum;
  search?: string;
};
