import type { Control, UseFormHandleSubmit } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

import type { OrderKeyEnum } from "@/common/enums/order-key";
import type { TUserTableCol } from "@/app/users/_types/user-table-col";

export type TUserTableFilterValues = {
  status: string | null;
  role: string | null;
};

export type TUserTableQuery = {
  page: number;
  pageSize: number;
  sortBy?: string;
  order?: OrderKeyEnum;
  search?: string;
};

export type TUserTableProps = {
  data: TUserTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TUserTableQuery;
  columnFilters: ColumnFiltersState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (key: string) => void;
  onSearchChange: (value: string) => void;
  control: Control<TUserTableFilterValues>;
  handleSubmit: UseFormHandleSubmit<TUserTableFilterValues>;
  onFilterSubmit: (data: TUserTableFilterValues) => void;
  onFilterReset: () => void;
};
