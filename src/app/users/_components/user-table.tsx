import { useCallback, useMemo, useState } from "react";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowUpDown,
  EllipsisVertical,
  Eye,
  Funnel,
  Pencil,
  Search,
  Trash,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
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
import CONFIG from "@/common/constants/config";
import type { TUserPaginationPayload } from "@/api/requestor/users/types/user-pagination-payload";
import { getUserPagination } from "@/api/requestor/users";
import type { TUserSortBy } from "@/api/requestor/users/consts/user-sort-by";
import type { TUserTableCol } from "@/app/users/_types/user-table-col";
import {
  UserTableFilterSchema,
  type TUserTableFilterSchema,
} from "@/app/users/_schema/user-table-filter";
import { toast } from "sonner";
import axios from "axios";
import type { TRequestorApiResponse } from "@/api/requestor/types/response";
import { useAuth } from "@/app/_hooks/use-auth";
import { DataTable } from "@/app/_components/data-table";
import { deleteUserById } from "@/api/requestor/users/[id]";

let debounceSearchTimeoutId: number | null = null;

export default function UserTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [confirmatedDeletedId, setConfirmatedDeletedId] = useState<
    string | null
  >(null);

  const queryTable = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("page_size") || 10),
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sort_by") || undefined,
      order: searchParams.get("order") || undefined,
      status: searchParams.get("status") || undefined,
      role: searchParams.get("role") || undefined,
    }),
    [searchParams],
  );

  const { control, handleSubmit, reset } = useForm<TUserTableFilterSchema>({
    resolver: zodResolver(UserTableFilterSchema),
    defaultValues: {
      status: (queryTable?.status as UserStatusEnum) || null,
      role: (queryTable?.role as RoleKeyEnum) || null,
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: deleteUserById,
    onMutate: () => {
      toast.loading("Deleting user...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("User deleted");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL()],
      });
    },
    onError: (error) => {
      toast.dismiss();
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        const defaultErrorResponse = error.response
          ?.data as TRequestorApiResponse<null>;

        switch (statusCode) {
          case 401:
            console.log("401");
            toast.error(defaultErrorResponse.message as string);
            logout();
            break;
          default:
            toast.error(defaultErrorResponse.message as string);
            break;
        }
      }
    },
  });

  const onDeleteUser = useCallback(() => {
    if (confirmatedDeletedId) {
      deleteUser(confirmatedDeletedId);
    }

    setConfirmatedDeletedId(null);
  }, [confirmatedDeletedId, deleteUser]);

  const onSearchChange = (value: string) => {
    if (value && value !== "" && value.length < 3) {
      return;
    }

    if (debounceSearchTimeoutId) {
      clearTimeout(debounceSearchTimeoutId);
    }

    debounceSearchTimeoutId = setTimeout(() => {
      setSearchParams((searchParams) => {
        searchParams.set("search", value);
        searchParams.set("page", "1");
        return searchParams;
      });
    }, 300);
  };

  const onFilterSubmit: SubmitHandler<TUserTableFilterSchema> = (data) => {
    setSearchParams((searchParams) => {
      searchParams.set("status", data.status || "");

      searchParams.set("role", data.role || "");

      searchParams.set("page", "1");

      return searchParams;
    });
  };

  const onFilterReset = useCallback(() => {
    reset({
      status: null,
      role: null,
    });
  }, [reset]);

  const mappedQueryTablePayload: TUserPaginationPayload = useMemo(
    () => ({
      page: queryTable.page,
      per_page: queryTable.pageSize,
      search: queryTable.search,
      sort_by: queryTable.sortBy as TUserSortBy,
      order: queryTable.order as OrderKeyEnum,
      status: queryTable.status as UserStatusEnum,
      role: queryTable.role as RoleKeyEnum,
    }),
    [queryTable],
  );

  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL(),
      mappedQueryTablePayload,
    ],
    queryFn: () => getUserPagination(mappedQueryTablePayload),
  });

  if (isError && error) {
    toast.dismiss();
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;

      const defaultErrorResponse = error.response
        ?.data as TRequestorApiResponse<null>;

      switch (statusCode) {
        case 401:
          console.log("401");
          toast.error(defaultErrorResponse.message as string);
          logout();
          break;
        default:
          toast.error(defaultErrorResponse.message as string);
          break;
      }
    }
  }

  const ascIcon = <ArrowDown01 />;
  const descIcon = <ArrowDown10 />;

  const applySorting = useCallback(
    (key: string) => {
      if (queryTable?.sortBy === key) {
        let desiredOrder = "";
        let desiredKey = key;
        switch (queryTable?.order) {
          case OrderKeyEnum.ASC:
            desiredOrder = OrderKeyEnum.DESC;
            break;
          case OrderKeyEnum.DESC:
            desiredOrder = "";
            desiredKey = "";
            break;
          default:
            desiredOrder = OrderKeyEnum.ASC;
            break;
        }

        setSearchParams((searchParams) => {
          searchParams.set("order", desiredOrder);
          searchParams.set("sort_by", desiredKey);
          searchParams.set("page", "1");
          return searchParams;
        });
      } else {
        setSearchParams((searchParams) => {
          searchParams.set("sort_by", key);
          searchParams.set("order", OrderKeyEnum.ASC);
          return searchParams;
        });
      }
    },
    [searchParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams((searchParams) => {
        searchParams.set("page", page.toString());
        return searchParams;
      });
    },
    [setSearchParams],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setSearchParams((searchParams) => {
        searchParams.set("page_size", pageSize.toString());
        searchParams.set("page", "1");
        return searchParams;
      });
    },
    [setSearchParams],
  );

  const columnHelper = createColumnHelper<TUserTableCol>();
  const columns = [
    columnHelper.display({
      id: "no",
      header: "No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        return pageIndex + row.index + 1;
      },
    }),

    columnHelper.accessor("name", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("name")}
        >
          Name
          {queryTable?.sortBy === "name" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "name" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "name" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("email", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("email")}
        >
          Email
          {queryTable?.sortBy === "email" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "email" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "email" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("role", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("role")}
        >
          Role
          {queryTable?.sortBy === "role" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "role" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "role" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("status")}
        >
          Status
          {queryTable?.sortBy === "status" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "status" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "status" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
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
                <DropdownMenuItem
                  render={<Link to={`/users/${user.id}/edit`} />}
                >
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setConfirmatedDeletedId(user.id)}
                >
                  <Trash />
                  Delete{" "}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters = [];
    if (queryTable?.status) {
      filters.push({
        id: "status",
        value: queryTable?.status as UserStatusEnum,
      });
    }

    if (queryTable?.role) {
      filters.push({
        id: "role",
        value: queryTable?.role as RoleKeyEnum,
      });
    }

    return filters;
  }, [queryTable?.status, queryTable?.role]);

  const sorting = useMemo<SortingState>(() => {
    const sort = [];

    if (queryTable?.sortBy) {
      sort.push({
        id: queryTable?.sortBy,
        desc: queryTable?.order === OrderKeyEnum.DESC,
      });
    }

    return sort;
  }, [queryTable?.sortBy, queryTable?.order]);

  const pageIndex = useMemo(
    () =>
      ((responseData?.data?.data?.meta?.current_page || 1) - 1) *
        (responseData?.data?.data?.meta?.max_view || 1) || 0,
    [
      responseData?.data?.data?.meta?.current_page,
      responseData?.data?.data?.meta?.max_view,
    ],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={responseData?.data?.data?.items ?? []}
        isLoading={isLoading}
        pageCount={responseData?.data?.data?.meta?.total_page || 1}
        rowCount={responseData?.data?.data?.meta?.total_all_data || 0}
        pageIndex={pageIndex}
        pageSize={queryTable?.pageSize || 10}
        sorting={sorting}
        columnFilters={columnFilters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
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
              placeholder="Search..."
              onChange={(val) => onSearchChange(val.target.value)}
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
            <AlertDialogAction onClick={onDeleteUser}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
