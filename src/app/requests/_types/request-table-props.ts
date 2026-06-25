import type {
  Control,
  UseFormHandleSubmit,
  UseFormSetError,
} from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

import type { OrderKeyEnum } from "@/common/enums/order-key";
import type { TRequestTableCol } from "@/app/requests/_types/request-table-col";

export type TRequestTableFilterValues = {
  status: string | null;
  priority: string | null;
};

export type TRequestTableQuery = {
  page: number;
  pageSize: number;
  sortBy?: string;
  order?: OrderKeyEnum;
  search?: string;
};

export type TRequestTableProps = {
  data: TRequestTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TRequestTableQuery;
  columnFilters: ColumnFiltersState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (key: string) => void;
  onSearchChange: (value: string) => void;
  control: Control<TRequestTableFilterValues>;
  handleSubmit: UseFormHandleSubmit<TRequestTableFilterValues>;
  setError: UseFormSetError<TRequestTableFilterValues>;
  onFilterSubmit: (data: TRequestTableFilterValues) => void;
  onFilterReset: () => void;
};
