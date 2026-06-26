import type { Control, UseFormHandleSubmit } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

import type { TTableQuery } from "@/app/_types/table-query";
import type { TAuditLogTableCol } from "@/app/audit-logs/_types/audit-log-table-col";

export type TAuditLogTableFilterValues = {
  action: string | null;
  targetType: string | null;
};

export type TAuditLogTableProps = {
  data: TAuditLogTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TTableQuery;
  columnFilters: ColumnFiltersState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange: (key: string) => void;
  onSearchChange: (value: string) => void;
  control: Control<TAuditLogTableFilterValues>;
  handleSubmit: UseFormHandleSubmit<TAuditLogTableFilterValues>;
  onFilterSubmit: (data: TAuditLogTableFilterValues) => void;
  onFilterReset: () => void;
};
