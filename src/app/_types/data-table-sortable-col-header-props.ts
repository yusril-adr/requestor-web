import type { OrderKeyEnum } from "@/common/enums/order-key";

export type TDataTableSortableColHeaderProps = {
  label: string;
  sortKey: string;
  sortBy?: string;
  order?: OrderKeyEnum;
  onClick: () => void;
};
