import type { TableOptions } from "@tanstack/react-table";

export type TDataTableProps<TData> = {
  data: TData[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  children?: React.ReactNode;
  tableOptions?: Omit<
    Partial<TableOptions<TData>>,
    "data" | "getCoreRowModel"
  > & { rowCount?: number };
};
