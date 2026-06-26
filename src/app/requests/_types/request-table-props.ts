import type { Control, UseFormHandleSubmit } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

import type { TTableQuery } from "@/app/_types/table-query";
import type { TRequestTableCol } from "@/app/requests/_types/request-table-col";

export type TRequestTableFilterValues = {
  status: string | null;
  priority: string | null;
};

export type TRequestTableProps = {
  data: TRequestTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TTableQuery;
  columnFilters: ColumnFiltersState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (key: string) => void;
  onSearchChange: (value: string) => void;
  control: Control<TRequestTableFilterValues>;
  handleSubmit: UseFormHandleSubmit<TRequestTableFilterValues>;
  onFilterSubmit: (data: TRequestTableFilterValues) => void;
  onFilterReset: () => void;
  onDeleteRequest: (id: string) => void;
};
