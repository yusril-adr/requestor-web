import { useMemo } from "react";
import { Funnel, Search } from "lucide-react";
import { Controller } from "react-hook-form";
import type { SortingState } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";

import { Button } from "@/app/_components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/app/_components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/app/_components/ui/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";

import { OrderKeyEnum } from "@/common/enums/order-key";
import type { TAuditLogTableCol } from "@/app/audit-logs/_types/audit-log-table-col";
import type { TAuditLogTableProps } from "@/app/audit-logs/_types/audit-log-table-props";
import {
  DataTable,
  DataTableSortableColHeader,
} from "@/app/_components/data-table";
import { AuditLogActionEnum } from "@/api/main/audit-logs/enums/audit-log-action";
import { AuditLogEntityEnum } from "@/api/main/audit-logs/enums/audit-log-entity";
import dayjs from "@/libs/dayjs";

export default function AuditLogTable({
  data,
  isLoading,
  pageCount,
  rowCount,
  queryTable,
  columnFilters,
  onActionHandler,
}: TAuditLogTableProps) {
  const filterForm = onActionHandler.onFilterForm!;

  const columnHelper = createColumnHelper<TAuditLogTableCol>();
  const columns = [
    columnHelper.display({
      id: "no",
      header: "No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const startIndex = (pageIndex - 1) * pageSize;
        return `${startIndex + row.index + 1}.`;
      },
    }),

    columnHelper.accessor("actor_name", {
      header: () => (
        <DataTableSortableColHeader
          label="Actor Name"
          sortKey="actor_name"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("actor_name")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("action", {
      header: () => (
        <DataTableSortableColHeader
          label="Action"
          sortKey="action"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("action")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("target_type", {
      header: () => (
        <DataTableSortableColHeader
          label="Target Type"
          sortKey="target_type"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("target_type")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("target_id", {
      header: () => (
        <DataTableSortableColHeader
          label="Target Id"
          sortKey="target_id"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("target_id")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("created_at", {
      header: () => (
        <DataTableSortableColHeader
          label="Created At"
          sortKey="created_at"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("created_at")}
        />
      ),
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    }),
  ];

  const sorting = useMemo<SortingState>(() => {
    const sort = [];

    if (queryTable.sortBy) {
      sort.push({
        id: queryTable.sortBy,
        desc: queryTable.order === OrderKeyEnum.DESC,
      });
    }

    return sort;
  }, [queryTable.sortBy, queryTable.order]);

  return (
    <DataTable
      data={data}
      isLoading={isLoading}
      onPageChange={onActionHandler.onPageChange}
      onPageSizeChange={onActionHandler.onPageSizeChange}
      tableOptions={{
        columns,
        pageCount,
        rowCount,
        state: {
          pagination: {
            pageIndex: queryTable.page,
            pageSize: queryTable.pageSize,
          },
          sorting,
          columnFilters,
        },
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <Funnel />
            Filter
          </PopoverTrigger>
          <PopoverContent align="start">
            <form
              className="flex flex-col gap-4 md:gap-2"
              onSubmit={filterForm.onFilterSubmit}
            >
              <FieldGroup className="flex flex-col md:flex-row gap-4 md:gap-2">
                <Controller
                  name="action"
                  control={filterForm.filterControl}
                  render={({ field, fieldState }) => (
                    <Field
                      className="grid gap-2"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="action">Action</FieldLabel>
                      <Combobox
                        id="action"
                        items={Object.values(AuditLogActionEnum)}
                        onValueChange={field.onChange}
                        {...field}
                      >
                        <ComboboxInput placeholder="Select action" showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  )}
                />

                <Controller
                  name="targetType"
                  control={filterForm.filterControl}
                  render={({ field, fieldState }) => (
                    <Field
                      className="grid gap-2"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="target-type">Target Type</FieldLabel>
                      <Combobox
                        id="target-type"
                        items={Object.values(AuditLogEntityEnum)}
                        onValueChange={(value) => {
                          field.onChange(value === "" ? undefined : value);
                        }}
                        {...field}
                      >
                        <ComboboxInput
                          placeholder="Select target type"
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup className="mt-2">
                <Field orientation="horizontal">
                  <Button
                    className="ms-auto"
                    variant="outline"
                    type="reset"
                    onClick={filterForm.onFilterReset}
                  >
                    Clear
                  </Button>

                  <Button type="submit">Apply</Button>
                </Field>
              </FieldGroup>
            </form>
          </PopoverContent>
        </Popover>

        <InputGroup>
          <InputGroupInput
            placeholder="Type minimum 3 characters to search ..."
            onChange={(val) =>
              onActionHandler.onSearchChange?.(val.target.value)
            }
            defaultValue={queryTable.search}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </DataTable>
  );
}
