import { useCallback, useMemo } from "react";
import { Funnel, Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";

import { OrderKeyEnum } from "@/common/enums/order-key";
import CONFIG from "@/common/constants/config";
import type { TAuditLogPaginationPayload } from "@/api/requestor/audit-logs/types/audit-log-pagination-payload";
import { getAuditLogPagination } from "@/api/requestor/audit-logs";
import type { TAuditLogSortBy } from "@/api/requestor/audit-logs/consts/audit-log-sort-by";
import type { TAuditLogTableCol } from "@/app/audit-logs/_types/audit-log-table-col";
import {
  DataTable,
  DataTableSortableColHeader,
} from "@/app/_components/data-table";
import { AuditLogActionEnum } from "@/api/requestor/audit-logs/enums/audit-log-action";
import { AuditLogEntityEnum } from "@/api/requestor/audit-logs/enums/audit-log-entity";
import dayjs from "@/libs/dayjs";

type TAuditLogTableFilterValues = {
  action: string | null;
  targetType: string | null;
};

let debounceSearchTimeoutId: number | null = null;

export default function AuditLogTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryTable = useMemo(
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
      action: (queryTable?.action as AuditLogActionEnum) || null,
      targetType: (queryTable?.targetType as AuditLogEntityEnum) || null,
    },
  });

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

  const onFilterSubmit: SubmitHandler<TAuditLogTableFilterValues> = (data) => {
    setSearchParams((searchParams) => {
      searchParams.set("action", data.action || "");

      searchParams.set("target_type", data.targetType || "");

      searchParams.set("page", "1");

      return searchParams;
    });
  };

  const onFilterReset = useCallback(() => {
    reset({
      action: null,
      targetType: null,
    });

    setSearchParams((searchParams) => {
      searchParams.delete("action");
      searchParams.delete("target_type");
      searchParams.set("page", "1");
      return searchParams;
    });
  }, [reset, setSearchParams]);

  const mappedQueryTablePayload: TAuditLogPaginationPayload = useMemo(
    () => ({
      page: queryTable.page,
      per_page: queryTable.pageSize,
      search: queryTable.search,
      sort_by: queryTable.sortBy as TAuditLogSortBy,
      order: queryTable.order,
      action: queryTable.action as AuditLogActionEnum,
      target_type: queryTable.targetType as AuditLogEntityEnum,
    }),
    [queryTable],
  );

  const { data: responseData, isLoading } = useQuery({
    queryKey: [
      CONFIG.QUERY_KEY.REQUESTOR_API.AUDIT_LOG.ALL(),
      mappedQueryTablePayload,
    ],
    queryFn: () => getAuditLogPagination(mappedQueryTablePayload),
  });

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

  const columnHelper = createColumnHelper<TAuditLogTableCol>();
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

    columnHelper.accessor("actor_name", {
      header: () => (
        <DataTableSortableColHeader
          label="Actor Name"
          sortKey="actor_name"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("actor_name")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("action", {
      header: () => (
        <DataTableSortableColHeader
          label="Action"
          sortKey="action"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("action")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("target_type", {
      header: () => (
        <DataTableSortableColHeader
          label="Target Type"
          sortKey="target_type"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("target_type")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("target_id", {
      header: () => (
        <DataTableSortableColHeader
          label="Target Id"
          sortKey="target_id"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("target_id")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("created_at", {
      header: () => (
        <DataTableSortableColHeader
          label="Created At"
          sortKey="created_at"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("created_at")}
        />
      ),
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
    }),
  ];

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters = [];
    if (queryTable?.action) {
      filters.push({
        id: "action",
        value: queryTable?.action,
      });
    }

    if (queryTable?.targetType) {
      filters.push({
        id: "targetType",
        value: queryTable?.targetType,
      });
    }

    return filters;
  }, [queryTable?.action, queryTable?.targetType]);

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

  return (
    <DataTable
      data={responseData?.data?.data?.items ?? []}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      tableOptions={{
        columns,
        pageCount: responseData?.data?.data?.meta?.total_page || 1,
        rowCount: responseData?.data?.data?.meta?.total_all_data || 0,
        state: {
          pagination: {
            pageIndex: responseData?.data?.data?.meta?.current_page || 1,
            pageSize: queryTable?.pageSize || 10,
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
                  name="action"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="grid gap-2"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="action">Action</FieldLabel>
                      <Combobox
                        id="action"
                        items={Object.values(AuditLogActionEnum)}
                        onValueChange={field.onChange}
                        {...field}
                      >
                        <ComboboxInput placeholder="Select action" showClear />
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
                  name="targetType"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="grid gap-2"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="target-type">Target Type</FieldLabel>
                      <Combobox
                        id="target-type"
                        items={Object.values(AuditLogEntityEnum)}
                        onValueChange={(value) => {
                          field.onChange(value === "" ? undefined : value);
                        }}
                        {...field}
                      >
                        <ComboboxInput
                          placeholder="Select target type"
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
            defaultValue={queryTable?.search}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </DataTable>
  );
}
