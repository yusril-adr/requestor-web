import { useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import UserTable from "@/app/users/_components/user-table";
import { Button } from "@/app/_components/ui/button";
import { useFilter } from "@/app/_hooks/use-filter";
import { useGetUserPagination } from "@/app/users/_hooks/use-get-user-pagination";
import { useDeleteUserById } from "@/app/users/_hooks/use-delete-user-by-id";
import { useUpdateUserById } from "@/app/users/_hooks/use-update-user-by-id";
import { createSortByParser } from "@/libs/nuqs/parse-sort-by";
import { useCamelCaseQueryStates } from "@/libs/nuqs/use-camel-case-query-states";
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
  const [queryStates, setQueryStates] = useCamelCaseQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    sortBy: createSortByParser(
      ["id", "name", "email", "role", "status", "created_at", "updated_at"] as const,
      "Users",
    ),
    order: parseAsStringEnum<OrderKeyEnum>(Object.values(OrderKeyEnum)),
    status: parseAsStringEnum<UserStatusEnum>(Object.values(UserStatusEnum)),
    role: parseAsStringEnum<RoleKeyEnum>(Object.values(RoleKeyEnum)),
  });
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm<TUserTableFilterValues>({
    defaultValues: {
      status: (queryStates.status as UserStatusEnum) || null,
      role: (queryStates.role as RoleKeyEnum) || null,
    },
  });

  const { onFilterReset, onFilterSubmit, columnFilters } =
    useFilter<TUserTableFilterValues>(
      ["status", "role"],
      queryStates,
      setQueryStates,
      reset,
    );

  const queryStatesIntoPayload: TUserPaginationPayload = useMemo(
    () => ({
      page: queryStates.page,
      per_page: queryStates.pageSize,
      search: queryStates.search,
      // nuqs parsers return null when unset, but API expects undefined — coalesce
      sort_by: queryStates.sortBy ?? undefined,
      order: queryStates.order ?? undefined,
      status: queryStates.status ?? undefined,
      role: queryStates.role ?? undefined,
    }),
    [queryStates],
  );

  const { data: responseData, isLoading } =
    useGetUserPagination(queryStatesIntoPayload);
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
      if (queryStates.sortBy === key) {
        let desiredOrder: OrderKeyEnum | null = null;
        let desiredKey: TUserSortBy | null = key as TUserSortBy;

        switch (queryStates.order) {
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
          sortBy: desiredKey,
          page: 1,
        });
      } else {
        setQueryStates({
          sortBy: key as TUserSortBy,
          order: OrderKeyEnum.ASC,
          page: 1,
        });
      }
    },
    [queryStates.order, queryStates.sortBy, setQueryStates],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setQueryStates({ page });
    },
    [setQueryStates],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setQueryStates({ pageSize: pageSize, page: 1 });
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
          queryTable={queryStates}
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
