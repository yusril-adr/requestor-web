import type { Control, UseFormHandleSubmit } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

import type { OrderKeyEnum } from "@/common/enums/order-key";
import type { TAuditLogTableCol } from "@/app/audit-logs/_types/audit-log-table-col";

export type TAuditLogTableFilterValues = {
  action: string | null;
  targetType: string | null;
};

export type TAuditLogTableQuery = {
  page: number;
  pageSize: number;
  sortBy?: string;
  order?: OrderKeyEnum;
  search?: string;
};

export type TAuditLogTableProps = {
  data: TAuditLogTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TAuditLogTableQuery;
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
