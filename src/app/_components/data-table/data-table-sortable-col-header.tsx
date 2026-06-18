import { ArrowUp01, ArrowDown10, ArrowUpDown } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { OrderKeyEnum } from "@/common/enums/order-key";
import type { TDataTableSortableColHeaderProps } from "@/app/_types/data-table-sortable-col-header-props";

export function DataTableSortableColHeader({
  label,
  sortKey,
  sortBy,
  order,
  onClick,
}: TDataTableSortableColHeaderProps) {
  const isActive = sortBy === sortKey;

  return (
    <Button
      variant="ghost"
      className="flex w-full justify-between p-0"
      onClick={onClick}
    >
      {label}
      {isActive && order === OrderKeyEnum.ASC && <ArrowUp01 />}
      {isActive && order === OrderKeyEnum.DESC && <ArrowDown10 />}
      {!isActive && <ArrowUpDown />}
    </Button>
  );
}
