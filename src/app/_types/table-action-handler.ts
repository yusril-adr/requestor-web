import type { SubmitEventHandler } from "react";
import type { Control, FieldValues } from "react-hook-form";

export type TTableFilterForm<TFilterValues extends FieldValues> = {
  filterControl: Control<TFilterValues>;
  onFilterSubmit: SubmitEventHandler<HTMLFormElement>;
  onFilterReset: () => void;
};

export type TTableActionHandler<TFilterValues extends FieldValues> = {
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortingChange?: (key: string) => void;
  onSearchChange?: (value: string) => void;
  onFilterForm?: TTableFilterForm<TFilterValues>;
};
