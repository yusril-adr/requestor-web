import { useCallback, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import { Button } from "@/app/_components/ui/button";
import { useFilter } from "@/app/_hooks/use-filter";
import RequestTable from "@/app/requests/_components/request-table";
import { useGetRequestPagination } from "@/app/requests/_hooks/use-get-request-pagination";
import type { TRequestTableFilterValues } from "@/app/requests/_types/request-table-props";
import type { TRequestPaginationPayload } from "@/api/requestor/requests/types/request-pagination-payload";
import type { TRequestSortBy } from "@/api/requestor/requests/consts/request-sort-by";
import type { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";
import type { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";
import { OrderKeyEnum } from "@/common/enums/order-key";
import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";

let debounceSearchTimeoutId: number | null = null;

export function meta() {
  return [
    {
      title: "Requestor - Requests",
    },
  ];
}

export default function RequstPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
      priority: searchParams.get("priority") || undefined,
    }),
    [searchParams],
  );

  const { control, handleSubmit, reset, setError } =
    useForm<TRequestTableFilterValues>({
      defaultValues: {
        status: (queryUrl.status as RequestStatusEnum) || null,
        priority: (queryUrl.priority as RequestPriorityEnum) || null,
      },
    });

  const { onFilterReset, onFilterSubmit, columnFilters } =
    useFilter<TRequestTableFilterValues>(
      [
        {
          formName: "status",
          urlParam: "status",
          columnId: "status",
          apiField: "status",
        },
        {
          formName: "priority",
          urlParam: "priority",
          columnId: "priority",
          apiField: "priority",
        },
      ],
      queryUrl,
      setSearchParams,
      reset,
    );

  const queryUrlIntoPayload: TRequestPaginationPayload = useMemo(
    () => ({
      page: queryUrl.page,
      per_page: queryUrl.pageSize,
      search: queryUrl.search,
      sort_by: queryUrl.sortBy as TRequestSortBy,
      order: queryUrl.order,
      status: queryUrl.status as RequestStatusEnum,
      priority: queryUrl.priority as RequestPriorityEnum,
    }),
    [queryUrl],
  );

  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useGetRequestPagination(queryUrlIntoPayload);

  useEffect(() => {
    if (isError && error && error instanceof RequestorAPINotFoundError) {
      navigate("/requests");
    }
  }, [isError, error, navigate]);

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
      name: "Requests",
    },
  ];

  return (
    <div className="w-full flex justify-center min-w-0">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <div className="flex flex-col">
          <AppBreadcrumb items={breadcrumbItems} />

          <div className="flex justify-between items-center mt-4 mb-6">
            <h1 className="font-heading text-2xl">Requests</h1>

            <Button
              render={<Link to="/requests/create" />}
              nativeButton={false}
            >
              <Plus /> Add Request
            </Button>
          </div>
        </div>
        <RequestTable
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
          setError={setError}
          onFilterSubmit={onFilterSubmit}
          onFilterReset={onFilterReset}
        />
      </div>
    </div>
  );
}
