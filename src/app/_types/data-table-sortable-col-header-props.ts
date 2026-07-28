import type { OrderKeyEnum } from "@/common/enums/order-key";

export type TDataTableSortableColHeaderProps = {
  label: string;
  sortKey: string;
  sortBy?: string | null;
  order?: OrderKeyEnum | null;
  onClick: () => void;
};
