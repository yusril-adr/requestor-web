import { useCallback, useMemo, useState } from "react";
import {
  Ban,
  EllipsisVertical,
  Eye,
  Funnel,
  Pencil,
  Search,
  ShieldCheck,
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
import { RoleKeyEnum } from "@/common/enums/role-key";
import { UserStatusEnum } from "@/api/requestor/users/enums/user-status";
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
import { ConfirmDeleteUserDialog } from "./confirm-delete-user-dialog";
import { ConfirmSuspendUserDialog } from "./confirm-suspend-user-dialog";
import { ConfirmReactivateUserDialog } from "./confirm-reactivate-user-dialog";

import { OrderKeyEnum } from "@/common/enums/order-key";
import type { TUserTableCol } from "@/app/users/_types/user-table-col";
import type { TUserTableProps } from "@/app/users/_types/user-table-props";
import { useAuthContext } from "@/app/_hooks/use-auth-context";
import {
  DataTable,
  DataTableSortableColHeader,
} from "@/app/_components/data-table";
import { useDeleteUserById } from "@/app/users/_hooks/use-delete-user-by-id";
import { useUpdateUserById } from "@/app/users/_hooks/use-update-user-by-id";

export default function UserTable({
  data,
  isLoading,
  pageCount,
  rowCount,
  queryTable,
  columnFilters,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  onSearchChange,
  control,
  handleSubmit,
  onFilterSubmit,
  onFilterReset,
}: TUserTableProps) {
  const { auth } = useAuthContext();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmSuspendId, setConfirmSuspendId] = useState<string | null>(null);
  const [confirmReactivateId, setConfirmReactivateId] = useState<string | null>(
    null,
  );

  const { mutate: deleteUserMutate } = useDeleteUserById();
  const { mutate: updateUserMutate } = useUpdateUserById();

  const onDeleteConfirm = useCallback(() => {
    if (confirmDeleteId) {
      deleteUserMutate(confirmDeleteId);
    }
    setConfirmDeleteId(null);
  }, [confirmDeleteId, deleteUserMutate]);

  const onSuspendConfirm = useCallback(() => {
    if (confirmSuspendId) {
      updateUserMutate({
        id: confirmSuspendId,
        payload: { status: UserStatusEnum.SUSPENDED },
      });
    }
    setConfirmSuspendId(null);
  }, [confirmSuspendId, updateUserMutate]);

  const onReactivateConfirm = useCallback(() => {
    if (confirmReactivateId) {
      updateUserMutate({
        id: confirmReactivateId,
        payload: { status: UserStatusEnum.ACTIVE },
      });
    }
    setConfirmReactivateId(null);
  }, [confirmReactivateId, updateUserMutate]);

  const allowedActionRoles = [RoleKeyEnum.ADMIN, RoleKeyEnum.OPERATOR];
  const columnHelper = createColumnHelper<TUserTableCol>();
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

    columnHelper.accessor("name", {
      header: () => (
        <DataTableSortableColHeader
          label="Name"
          sortKey="name"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onSortingChange("name")}
        />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            variant="link"
            render={<Link to={`/users/${user.id}`} />}
            nativeButton={false}
          >
            {user.name}
          </Button>
        );
      },
    }),

    columnHelper.accessor("email", {
      header: () => (
        <DataTableSortableColHeader
          label="Email"
          sortKey="email"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onSortingChange("email")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("role", {
      header: () => (
        <DataTableSortableColHeader
          label="Role"
          sortKey="role"
          sortBy={queryTable.sortBy}
          order={queryTable.order}
          onClick={() => onSortingChange("role")}
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
          onClick={() => onSortingChange("status")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const currentRole = auth?.role || RoleKeyEnum.VIEWER;
        const user = row.original;

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
                <DropdownMenuItem render={<Link to={`/users/${user.id}`} />}>
                  <Eye />
                  View
                </DropdownMenuItem>

                {allowedActionRoles.includes(currentRole) && (
                  <DropdownMenuItem
                    render={<Link to={`/users/${user.id}/edit`} />}
                  >
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                )}

                {allowedActionRoles.includes(currentRole) &&
                  user.status !== UserStatusEnum.SUSPENDED && (
                    <DropdownMenuItem
                      onClick={() => setConfirmSuspendId(user.id)}
                    >
                      <Ban />
                      Suspend
                    </DropdownMenuItem>
                  )}

                {allowedActionRoles.includes(currentRole) &&
                  user.status === UserStatusEnum.SUSPENDED && (
                    <DropdownMenuItem
                      onClick={() => setConfirmReactivateId(user.id)}
                    >
                      <ShieldCheck />
                      Reactivate
                    </DropdownMenuItem>
                  )}

                {allowedActionRoles.includes(currentRole) && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setConfirmDeleteId(user.id)}
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
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
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
                onSubmit={handleSubmit(onFilterSubmit)}
              >
                <FieldGroup className="flex flex-col md:flex-row gap-4 md:gap-2">
                  <Controller
                    name="role"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="grid gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="role">Role</FieldLabel>
                        <Combobox
                          id="role"
                          items={Object.values(RoleKeyEnum)}
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <ComboboxInput placeholder="Select role" showClear />
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
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="grid gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Combobox
                          id="status"
                          items={Object.values(UserStatusEnum)}
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
                </FieldGroup>

                <FieldGroup className="mt-2">
                  <Field orientation="horizontal">
                    <Button
                      className="ms-auto"
                      variant="outline"
                      type="reset"
                      onClick={onFilterReset}
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
              onChange={(val) => onSearchChange(val.target.value)}
              defaultValue={queryTable.search}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </DataTable>

      <ConfirmDeleteUserDialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
        onConfirm={onDeleteConfirm}
      />
      <ConfirmSuspendUserDialog
        open={!!confirmSuspendId}
        onOpenChange={() => setConfirmSuspendId(null)}
        onConfirm={onSuspendConfirm}
      />
      <ConfirmReactivateUserDialog
        open={!!confirmReactivateId}
        onOpenChange={() => setConfirmReactivateId(null)}
        onConfirm={onReactivateConfirm}
      />
    </>
  );
}
