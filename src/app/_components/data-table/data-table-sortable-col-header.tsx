import { ArrowUp01, ArrowDown10, ArrowUpDown } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { OrderKeyEnum } from "@/common/enums/order-key";

export type TDataTableSortableColHeaderProps = {
  label: string;
  sortKey: string;
  sortBy?: string;
  order?: OrderKeyEnum;
  onClick: () => void;
};

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
