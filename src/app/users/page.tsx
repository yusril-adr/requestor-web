import { useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useQueryStates, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import UserTable from "@/app/users/_components/user-table";
import { Button } from "@/app/_components/ui/button";
import { useFilter } from "@/app/_hooks/use-filter";
import { useGetUserPagination } from "@/app/users/_hooks/use-get-user-pagination";
import { useDeleteUserById } from "@/app/users/_hooks/use-delete-user-by-id";
import { useUpdateUserById } from "@/app/users/_hooks/use-update-user-by-id";
import { createSortByParser } from "@/libs/nuqs/parse-sort-by";
import type { TUserTableFilterValues } from "@/app/users/_types/user-table-props";
import type { TUserPaginationPayload } from "@/api/requestor/users/types/user-pagination-payload";
import type { TUserSortBy } from "@/api/requestor/users/consts/user-sort-by";
import { UserStatusEnum } from "@/api/requestor/users/enums/user-status";
import { OrderKeyEnum } from "@/common/enums/order-key";
import { RoleKeyEnum } from "@/common/enums/role-key";
import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";

let debounceSearchTimeoutId: number | null = null;

export function meta() {
  return [
    {
      title: "Requestor - Users",
    },
  ];
}

export default function UserPage() {
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    page_size: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    sort_by: createSortByParser(
      ["id", "name", "email", "role", "status", "created_at", "updated_at"] as const,
      "Users",
    ),
    order: parseAsStringEnum<OrderKeyEnum>(Object.values(OrderKeyEnum)),
    status: parseAsStringEnum<UserStatusEnum>(Object.values(UserStatusEnum)),
    role: parseAsStringEnum<RoleKeyEnum>(Object.values(RoleKeyEnum)),
  });
  const navigate = useNavigate();

  const queryUrl = useMemo(
    () => ({
      page: queryStates.page,
      pageSize: queryStates.page_size,
      search: queryStates.search || undefined,
      sortBy: queryStates.sort_by ?? undefined,
      order: queryStates.order ?? undefined,
      status: queryStates.status ?? undefined,
      role: queryStates.role ?? undefined,
    }),
    [queryStates],
  );

  const { control, handleSubmit, reset } = useForm<TUserTableFilterValues>({
    defaultValues: {
      status: (queryUrl.status as UserStatusEnum) || null,
      role: (queryUrl.role as RoleKeyEnum) || null,
    },
  });

  const { onFilterReset, onFilterSubmit, columnFilters } =
    useFilter<TUserTableFilterValues>(
      ["status", "role"],
      queryUrl,
      setQueryStates,
      reset,
    );

  const queryUrlIntoPayload: TUserPaginationPayload = useMemo(
    () => ({
      page: queryUrl.page,
      per_page: queryUrl.pageSize,
      search: queryUrl.search,
      sort_by: queryUrl.sortBy,
      order: queryUrl.order,
      status: queryUrl.status,
      role: queryUrl.role,
    }),
    [queryUrl],
  );

  const { data: responseData, isLoading } =
    useGetUserPagination(queryUrlIntoPayload);
  const { mutate: deleteUserMutate } = useDeleteUserById({
    onError: (error) => {
      if (error instanceof RequestorAPINotFoundError) {
        navigate("/users");
      }
    },
  });
  const { mutate: updateUserMutate } = useUpdateUserById({
    onError: (error) => {
      if (error instanceof RequestorAPINotFoundError) {
        navigate("/users");
      }
    },
  });

  const onSearchChange = useCallback(
    (value: string) => {
      if (value && value !== "" && value.length < 3) {
        return;
      }

      if (debounceSearchTimeoutId) {
        clearTimeout(debounceSearchTimeoutId);
      }

      debounceSearchTimeoutId = setTimeout(() => {
        setQueryStates({ search: value, page: 1 });
      }, 300);
    },
    [setQueryStates],
  );

  const applySorting = useCallback(
    (key: string) => {
      if (queryUrl.sortBy === key) {
        let desiredOrder: OrderKeyEnum | null = null;
        let desiredKey: TUserSortBy | null = key as TUserSortBy;

        switch (queryUrl.order) {
          case OrderKeyEnum.ASC:
            desiredOrder = OrderKeyEnum.DESC;
            break;
          case OrderKeyEnum.DESC:
            desiredKey = null;
            break;
          default:
            desiredOrder = OrderKeyEnum.ASC;
            break;
        }

        setQueryStates({
          order: desiredOrder,
          sort_by: desiredKey,
          page: 1,
        });
      } else {
        setQueryStates({
          sort_by: key as TUserSortBy,
          order: OrderKeyEnum.ASC,
          page: 1,
        });
      }
    },
    [queryUrl.order, queryUrl.sortBy, setQueryStates],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setQueryStates({ page });
    },
    [setQueryStates],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setQueryStates({ page_size: pageSize, page: 1 });
    },
    [setQueryStates],
  );

  const breadcrumbItems = [
    {
      name: "Users",
    },
  ];

  return (
    <div className="w-full flex justify-center min-w-0">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <div className="flex flex-col">
          <AppBreadcrumb items={breadcrumbItems} />

          <div className="flex justify-between items-center mt-4 mb-6">
            <h1 className="font-heading text-2xl">Users</h1>

            <Button render={<Link to="/users/create" />} nativeButton={false}>
              <Plus /> Add User
            </Button>
          </div>
        </div>
        <UserTable
          data={responseData?.data?.data?.items ?? []}
          isLoading={isLoading}
          pageCount={responseData?.data?.data?.meta?.total_page || 1}
          rowCount={responseData?.data?.data?.meta?.total_all_data || 0}
          queryTable={queryUrl}
          columnFilters={columnFilters}
          onActionHandler={{
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
            onSortingChange: applySorting,
            onSearchChange,
            onFilterForm: {
              filterControl: control,
              onFilterSubmit: handleSubmit(onFilterSubmit),
              onFilterReset,
            },
            onDeleteUser: deleteUserMutate,
            onSuspendUser: (id) =>
              updateUserMutate({
                id,
                payload: { status: UserStatusEnum.SUSPENDED },
              }),
            onReactivateUser: (id) =>
              updateUserMutate({
                id,
                payload: { status: UserStatusEnum.ACTIVE },
              }),
          }}
        />
      </div>
    </div>
  );
}
