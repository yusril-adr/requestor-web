import { useCallback, useMemo, useState } from "react";
import {
  EllipsisVertical,
  Eye,
  Funnel,
  Pencil,
  Search,
  Trash,
} from "lucide-react";
import { Link } from "react-router";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";

import { OrderKeyEnum } from "@/common/enums/order-key";
import { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";
import type { TRequestTableCol } from "@/app/requests/_types/request-table-col";
import type { TRequestTableProps } from "@/app/requests/_types/request-table-props";

import { useAuthContext } from "@/app/_hooks/use-auth-context";
import {
  DataTable,
  DataTableSortableColHeader,
} from "@/app/_components/data-table";
import { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";
import { RoleKeyEnum } from "@/common/enums/role-key";

export default function RequestTable({
  data,
  isLoading,
  pageCount,
  rowCount,
  queryTable,
  columnFilters,
  onActionHandler,
}: TRequestTableProps) {
  const { auth } = useAuthContext();
  const filterForm = onActionHandler.onFilterForm!;
  const [confirmatedDeletedId, setConfirmatedDeletedId] = useState<
    string | null
  >(null);

  const onDeleteHandler = useCallback(() => {
    if (confirmatedDeletedId) {
      onActionHandler.onDeleteRequest(confirmatedDeletedId);
    }

    setConfirmatedDeletedId(null);
  }, [confirmatedDeletedId, onActionHandler]);

  const allowedActionRoles = [RoleKeyEnum.ADMIN, RoleKeyEnum.OPERATOR];

  const columnHelper = createColumnHelper<TRequestTableCol>();
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

    columnHelper.accessor("title", {
      header: () => (
        <DataTableSortableColHeader
          label="Name"
          sortKey="title"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("title")}
        />
      ),
      cell: ({ row }) => {
        const rowOriginal = row.original;
        return (
          <Button
            variant="link"
            render={<Link to={`/requests/${rowOriginal.id}`} />}
            nativeButton={false}
          >
            {rowOriginal.title}
          </Button>
        );
      },
    }),

    columnHelper.accessor("requestor_name", {
      header: () => (
        <DataTableSortableColHeader
          label="Requestor Name"
          sortKey="requestor_name"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("requestor_name")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
      header: () => (
        <DataTableSortableColHeader
          label="Status"
          sortKey="status"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("status")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("priority", {
      header: () => (
        <DataTableSortableColHeader
          label="Priority"
          sortKey="priority"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("priority")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("assignee_name", {
      header: () => (
        <DataTableSortableColHeader
          label="Assignee Name"
          sortKey="assignee_name"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onActionHandler.onSortingChange?.("assignee_name")}
        />
      ),
      cell: (info) => info.getValue() ?? "-",
    }),

    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const currentRole = auth?.role || RoleKeyEnum.VIEWER;
        const rowOriginal = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="icon-sm" variant="ghost">
                  <EllipsisVertical />
                </Button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={<Link to={`/requests/${rowOriginal.id}`} />}
                >
                  <Eye />
                  View
                </DropdownMenuItem>
                {allowedActionRoles.includes(currentRole) && (
                  <DropdownMenuItem
                    render={<Link to={`/requests/${rowOriginal.id}/edit`} />}
                  >
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                )}
                {allowedActionRoles.includes(currentRole) && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setConfirmatedDeletedId(rowOriginal.id)}
                  >
                    <Trash />
                    Delete{" "}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
    <>
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
                    name="status"
                    control={filterForm.filterControl}
                    render={({ field, fieldState }) => (
                      <Field
                        className="grid gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Combobox
                          id="status"
                          items={Object.values(RequestStatusEnum)}
                          onValueChange={(value) => {
                            field.onChange(value === "" ? undefined : value);
                          }}
                          {...field}
                        >
                          <ComboboxInput
                            placeholder="Select status"
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

                  <Controller
                    name="priority"
                    control={filterForm.filterControl}
                    render={({ field, fieldState }) => (
                      <Field
                        className="grid gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="priority">Priority</FieldLabel>
                        <Combobox
                          id="priority"
                          items={Object.values(RequestPriorityEnum)}
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <ComboboxInput
                            placeholder="Select priority"
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

      <AlertDialog
        open={!!confirmatedDeletedId}
        onOpenChange={() => setConfirmatedDeletedId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteHandler}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
