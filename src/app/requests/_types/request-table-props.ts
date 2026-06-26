import type { ColumnFiltersState } from "@tanstack/react-table";

import type { TTableActionHandler } from "@/app/_types/table-action-handler";
import type { TTableQuery } from "@/app/_types/table-query";
import type { TRequestTableCol } from "@/app/requests/_types/request-table-col";

export type TRequestTableFilterValues = {
  status: string | null;
  priority: string | null;
};

export type TRequestTableActionHandler =
  TTableActionHandler<TRequestTableFilterValues> & {
    onDeleteRequest: (id: string) => void;
  };

export type TRequestTableProps = {
  data: TRequestTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TTableQuery;
  columnFilters: ColumnFiltersState;
  onActionHandler: TRequestTableActionHandler;
};
