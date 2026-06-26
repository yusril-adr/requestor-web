import type { ColumnFiltersState } from "@tanstack/react-table";

import type { TTableActionHandler } from "@/app/_types/table-action-handler";
import type { TTableQuery } from "@/app/_types/table-query";
import type { TAuditLogTableCol } from "@/app/audit-logs/_types/audit-log-table-col";

export type TAuditLogTableFilterValues = {
  action: string | null;
  targetType: string | null;
};

export type TAuditLogTableActionHandler =
  TTableActionHandler<TAuditLogTableFilterValues>;

export type TAuditLogTableProps = {
  data: TAuditLogTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TTableQuery;
  columnFilters: ColumnFiltersState;
  onActionHandler: TAuditLogTableActionHandler;
};
