import { useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import UserTable from "@/app/users/_components/user-table";
import { Button } from "@/app/_components/ui/button";
import { useFilter } from "@/app/_hooks/use-filter";
import { useGetUserPagination } from "@/app/users/_hooks/use-get-user-pagination";
import type { TUserTableFilterValues } from "@/app/users/_types/user-table-props";
import type { TUserPaginationPayload } from "@/api/requestor/users/types/user-pagination-payload";
import type { TUserSortBy } from "@/api/requestor/users/consts/user-sort-by";
import { UserStatusEnum } from "@/api/requestor/users/enums/user-status";
import { OrderKeyEnum } from "@/common/enums/order-key";
import { RoleKeyEnum } from "@/common/enums/role-key";

let debounceSearchTimeoutId: number | null = null;

export function meta() {
  return [
    {
      title: "Requestor - Users",
    },
  ];
}

export default function UserPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryUrl = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("page_size") || 10),
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sort_by") || undefined,
      order: (searchParams.get("order") || undefined) as
        | OrderKeyEnum
        | undefined,
      status: searchParams.get("status") || undefined,
      role: searchParams.get("role") || undefined,
    }),
    [searchParams],
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
      setSearchParams,
      reset,
    );

  const queryUrlIntoPayload: TUserPaginationPayload = useMemo(
    () => ({
      page: queryUrl.page,
      per_page: queryUrl.pageSize,
      search: queryUrl.search,
      sort_by: queryUrl.sortBy as TUserSortBy,
      order: queryUrl.order,
      status: queryUrl.status as UserStatusEnum,
      role: queryUrl.role as RoleKeyEnum,
    }),
    [queryUrl],
  );

  const { data: responseData, isLoading } =
    useGetUserPagination(queryUrlIntoPayload);

  const onSearchChange = useCallback(
    (value: string) => {
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
    },
    [setSearchParams],
  );

  const applySorting = useCallback(
    (key: string) => {
      if (queryUrl.sortBy === key) {
        let desiredOrder = "";
        let desiredKey = key;
        switch (queryUrl.order) {
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
          searchParams.set("page", "1");
          return searchParams;
        });
      }
    },
    [queryUrl.order, queryUrl.sortBy, setSearchParams],
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
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortingChange={applySorting}
          onSearchChange={onSearchChange}
          control={control}
          handleSubmit={handleSubmit}
          onFilterSubmit={onFilterSubmit}
          onFilterReset={onFilterReset}
        />
      </div>
    </div>
  );
}
