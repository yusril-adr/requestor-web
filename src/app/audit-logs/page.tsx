import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useForm } from "react-hook-form";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import AuditLogTable from "@/app/audit-logs/_components/audit-log-table";
import { useFilter } from "@/app/_hooks/use-filter";
import { useGetAuditLogPagination } from "@/app/audit-logs/_hooks/use-get-audit-log-pagination";
import type { TAuditLogTableFilterValues } from "@/app/audit-logs/_types/audit-log-table-props";
import type { TAuditLogPaginationPayload } from "@/api/requestor/audit-logs/types/audit-log-pagination-payload";
import type { TAuditLogSortBy } from "@/api/requestor/audit-logs/consts/audit-log-sort-by";
import { AuditLogActionEnum } from "@/api/requestor/audit-logs/enums/audit-log-action";
import { AuditLogEntityEnum } from "@/api/requestor/audit-logs/enums/audit-log-entity";
import { OrderKeyEnum } from "@/common/enums/order-key";

let debounceSearchTimeoutId: number | null = null;

export function meta() {
  return [
    {
      title: "Requestor - Audit Logs",
    },
  ];
}

export default function AuditLogPage() {
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
      action: searchParams.get("action") || undefined,
      targetType: searchParams.get("target_type") || undefined,
    }),
    [searchParams],
  );

  const { control, handleSubmit, reset } = useForm<TAuditLogTableFilterValues>({
    defaultValues: {
      action: (queryUrl.action as AuditLogActionEnum) || null,
      targetType: (queryUrl.targetType as AuditLogEntityEnum) || null,
    },
  });

  const { onFilterReset, onFilterSubmit, columnFilters } =
    useFilter<TAuditLogTableFilterValues>(
      [
        {
          formName: "action",
          urlParam: "action",
          columnId: "action",
          apiField: "action",
        },
        {
          formName: "targetType",
          urlParam: "target_type",
          columnId: "target_type",
          apiField: "target_type",
        },
      ],
      queryUrl,
      setSearchParams,
      reset,
    );

  const queryUrlIntoPayload: TAuditLogPaginationPayload = useMemo(
    () => ({
      page: queryUrl.page,
      per_page: queryUrl.pageSize,
      search: queryUrl.search,
      sort_by: queryUrl.sortBy as TAuditLogSortBy,
      order: queryUrl.order,
      action: queryUrl.action as AuditLogActionEnum,
      target_type: queryUrl.targetType as AuditLogEntityEnum,
    }),
    [queryUrl],
  );

  const { data: responseData, isLoading } =
    useGetAuditLogPagination(queryUrlIntoPayload);

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
      name: "Audit Logs",
    },
  ];

  return (
    <div className="w-full flex justify-center min-w-0">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <div className="flex flex-col">
          <AppBreadcrumb items={breadcrumbItems} />

          <div className="flex justify-between items-center mt-4 mb-6">
            <h1 className="font-heading text-2xl">Audit Logs</h1>
          </div>
        </div>

        <AuditLogTable
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
