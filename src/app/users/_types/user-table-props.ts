import type { ColumnFiltersState } from "@tanstack/react-table";

import type { TTableActionHandler } from "@/app/_types/table-action-handler";
import type { TTableQuery } from "@/app/_types/table-query";
import type { TUserTableCol } from "@/app/users/_types/user-table-col";

export type TUserTableFilterValues = {
  status: string | null;
  role: string | null;
};

export type TUserTableActionHandler =
  TTableActionHandler<TUserTableFilterValues> & {
    onDeleteUser: (id: string) => void;
    onSuspendUser: (id: string) => void;
    onReactivateUser: (id: string) => void;
  };

export type TUserTableProps = {
  data: TUserTableCol[];
  isLoading: boolean;
  pageCount: number;
  rowCount: number;
  queryTable: TTableQuery;
  columnFilters: ColumnFiltersState;
  onActionHandler: TUserTableActionHandler;
};
