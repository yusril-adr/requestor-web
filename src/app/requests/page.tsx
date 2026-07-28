import { useCallback, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import { Button } from "@/app/_components/ui/button";
import { useFilter } from "@/app/_hooks/use-filter";
import RequestTable from "@/app/requests/_components/request-table";
import { useGetRequestPagination } from "@/app/requests/_hooks/use-get-request-pagination";
import { useDeleteRequestById } from "@/app/requests/_hooks/use-delete-request-by-id";
import { createSortByParser } from "@/libs/nuqs/parse-sort-by";
import { useCamelCaseQueryStates } from "@/libs/nuqs/use-camel-case-query-states";
import type { TRequestTableFilterValues } from "@/app/requests/_types/request-table-props";
import type { TRequestPaginationPayload } from "@/api/requestor/requests/types/request-pagination-payload";
import type { TRequestSortBy } from "@/api/requestor/requests/consts/request-sort-by";
import { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";
import { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";
import type { TRequestorApiErrorResponse } from "@/api/requestor/types/response";
import { OrderKeyEnum } from "@/common/enums/order-key";
import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";
import RequestorAPIValidationError from "@/api/requestor/errors/validation-error";
import { applyValidationErrors } from "@/utils/validation-helper";

let debounceSearchTimeoutId: number | null = null;

export function meta() {
  return [
    {
      title: "Requestor - Requests",
    },
  ];
}

export default function RequstPage() {
  const [queryStates, setQueryStates] = useCamelCaseQueryStates({
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    sortBy: createSortByParser(
      [
        "id",
        "title",
        "requestor_name",
        "status",
        "priority",
        "assignee_name",
        "created_at",
        "updated_at",
      ] as const,
      "Requests",
    ),
    order: parseAsStringEnum<OrderKeyEnum>(Object.values(OrderKeyEnum)),
    status: parseAsStringEnum<RequestStatusEnum>(
      Object.values(RequestStatusEnum),
    ),
    priority: parseAsStringEnum<RequestPriorityEnum>(
      Object.values(RequestPriorityEnum),
    ),
  });
  const navigate = useNavigate();

  const { control, handleSubmit, reset, setError } =
    useForm<TRequestTableFilterValues>({
      defaultValues: {
        status: (queryStates.status as RequestStatusEnum) || null,
        priority: (queryStates.priority as RequestPriorityEnum) || null,
      },
    });

  const { onFilterReset, onFilterSubmit, columnFilters } =
    useFilter<TRequestTableFilterValues>(
      ["status", "priority"],
      queryStates,
      setQueryStates,
      reset,
    );

  const queryStatesIntoPayload: TRequestPaginationPayload = useMemo(
    () => ({
      page: queryStates.page,
      per_page: queryStates.pageSize,
      search: queryStates.search,
      // nuqs parsers return null when unset, but API expects undefined — coalesce
      sort_by: queryStates.sortBy ?? undefined,
      order: queryStates.order ?? undefined,
      status: queryStates.status ?? undefined,
      priority: queryStates.priority ?? undefined,
    }),
    [queryStates],
  );

  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useGetRequestPagination(queryStatesIntoPayload);
  const { mutate: deleteRequestMutate } = useDeleteRequestById({
    onError: (error) => {
      if (error instanceof RequestorAPIValidationError) {
        return applyValidationErrors(
          setError,
          error.errors as TRequestorApiErrorResponse<null>[],
        );
      }

      if (error instanceof RequestorAPINotFoundError) {
        navigate("/requests");
      }
    },
  });

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
        setQueryStates({ search: value, page: 1 });
      }, 300);
    },
    [setQueryStates],
  );

  const applySorting = useCallback(
    (key: string) => {
      if (queryStates.sortBy === key) {
        let desiredOrder: OrderKeyEnum | null = null;
        let desiredKey: TRequestSortBy | null = key as TRequestSortBy;

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
          sortBy: key as TRequestSortBy,
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
            onDeleteRequest: deleteRequestMutate,
          }}
        />
      </div>
    </div>
  );
}
