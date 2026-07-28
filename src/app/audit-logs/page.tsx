import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import AuditLogTable from "@/app/audit-logs/_components/audit-log-table";
import { useFilter } from "@/app/_hooks/use-filter";
import { useGetAuditLogPagination } from "@/app/audit-logs/_hooks/use-get-audit-log-pagination";
import { createSortByParser } from "@/libs/nuqs/parse-sort-by";
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
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    page_size: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    sort_by: createSortByParser(
      [
        "id",
        "actor_name",
        "action",
        "target_type",
        "target_id",
        "created_at",
        "updated_at",
      ] as const,
      "Audit Logs",
    ),
    order: parseAsStringEnum<OrderKeyEnum>(Object.values(OrderKeyEnum)),
    action: parseAsStringEnum<AuditLogActionEnum>(
      Object.values(AuditLogActionEnum),
    ),
    target_type: parseAsStringEnum<AuditLogEntityEnum>(
      Object.values(AuditLogEntityEnum),
    ),
  });

  const queryUrl = useMemo(
    () => ({
      page: queryStates.page,
      pageSize: queryStates.page_size,
      search: queryStates.search,
      sortBy: queryStates.sort_by ?? undefined,
      order: queryStates.order ?? undefined,
      action: queryStates.action ?? undefined,
      targetType: queryStates.target_type ?? undefined,
    }),
    [queryStates],
  );

  const { control, handleSubmit, reset } = useForm<TAuditLogTableFilterValues>({
    defaultValues: {
      action: (queryUrl.action as AuditLogActionEnum) || null,
      targetType: (queryUrl.targetType as AuditLogEntityEnum) || null,
    },
  });

  const { onFilterReset, onFilterSubmit, columnFilters } =
    useFilter<TAuditLogTableFilterValues>(
      ["action", "targetType"],
      queryUrl,
      setQueryStates,
      reset,
    );

  const queryUrlIntoPayload: TAuditLogPaginationPayload = useMemo(
    () => ({
      page: queryUrl.page,
      per_page: queryUrl.pageSize,
      search: queryUrl.search,
      sort_by: queryUrl.sortBy,
      order: queryUrl.order,
      action: queryUrl.action,
      target_type: queryUrl.targetType,
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
        setQueryStates({ search: value, page: 1 });
      }, 300);
    },
    [setQueryStates],
  );

  const applySorting = useCallback(
    (key: string) => {
      if (queryUrl.sortBy === key) {
        let desiredOrder: OrderKeyEnum | null = null;
        let desiredKey: TAuditLogSortBy | null = key as TAuditLogSortBy;

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
          sort_by: key as TAuditLogSortBy,
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
          }}
        />
      </div>
    </div>
  );
}
