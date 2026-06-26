import type { Control, UseFormHandleSubmit } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

import type { TTableQuery } from "@/app/_types/table-query";
import type { TUserTableCol } from "@/app/users/_types/user-table-col";

export type TUserTableFilterValues = {
  status: string | null;
  role: string | null;
};

export type TUserTableProps = {
  data: TUserTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TTableQuery;
  columnFilters: ColumnFiltersState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (key: string) => void;
  onSearchChange: (value: string) => void;
  control: Control<TUserTableFilterValues>;
  handleSubmit: UseFormHandleSubmit<TUserTableFilterValues>;
  onFilterSubmit: (data: TUserTableFilterValues) => void;
  onFilterReset: () => void;
  onDeleteUser: (id: string) => void;
  onSuspendUser: (id: string) => void;
  onReactivateUser: (id: string) => void;
};
