import type {
  SortingState,
  ColumnFiltersState,
  TableOptions,
  ColumnDefBase,
  StringHeaderIdentifier,
  IdIdentifier,
  AccessorKeyColumnDefBase,
} from "@tanstack/react-table";

export type TDataTableProps<TData> = {
  columns: (
    | (ColumnDefBase<TData, unknown> & StringHeaderIdentifier)
    | (ColumnDefBase<TData, unknown> & IdIdentifier<TData, unknown>)
    | (AccessorKeyColumnDefBase<TData, string> &
        Partial<IdIdentifier<TData, string>>)
  )[];

  data: TData[];
  isLoading?: boolean;
  pageCount: number;
  rowCount: number;
  pageIndex: number;
  pageSize: number;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  children?: React.ReactNode;
  tableOptions?: Omit<
    Partial<TableOptions<TData>>,
    "data" | "columns" | "pageCount" | "getCoreRowModel"
  >;
};
