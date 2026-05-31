import { useCallback, useEffect, useMemo } from "react";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowUpDown,
  Funnel,
  Search,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  AuditLogTableFilterSchema,
  type TAuditLogTableFilterSchema,
} from "@/app/audit-logs/_schema/audit-log-table-filter";
import { toast } from "sonner";
import axios from "axios";
import type { TRequestorApiResponse } from "@/api/requestor/types/response";
import { useAuth } from "@/app/_hooks/use-auth";
import { DataTable } from "@/app/_components/data-table";
import { AuditLogActionEnum } from "@/api/requestor/audit-logs/enums/audit-log-action";
import { AuditLogEntityEnum } from "@/api/requestor/audit-logs/enums/audit-log-entity";

let debounceSearchTimeoutId: number | null = null;

export default function AuditLogTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();

  const queryTable = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("page_size") || 10),
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sort_by") || undefined,
      order: searchParams.get("order") || undefined,
      action: searchParams.get("action") || undefined,
      targetType: searchParams.get("target_type") || undefined,
    }),
    [searchParams],
  );

  const { control, handleSubmit, reset } = useForm<TAuditLogTableFilterSchema>({
    resolver: zodResolver(AuditLogTableFilterSchema),
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

  const onFilterSubmit: SubmitHandler<TAuditLogTableFilterSchema> = (data) => {
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
  }, [reset]);

  const mappedQueryTablePayload: TAuditLogPaginationPayload = useMemo(
    () => ({
      page: queryTable.page,
      per_page: queryTable.pageSize,
      search: queryTable.search,
      sort_by: queryTable.sortBy as TAuditLogSortBy,
      order: queryTable.order as OrderKeyEnum,
      action: queryTable.action as AuditLogActionEnum,
      target_type: queryTable.targetType as AuditLogEntityEnum,
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
      CONFIG.QUERY_KEY.REQUESTOR_API.AUDIT_LOG.ALL(),
      mappedQueryTablePayload,
    ],
    queryFn: () => getAuditLogPagination(mappedQueryTablePayload),
  });

  useEffect(() => {
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
  }, [isError, error, logout]);

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
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("actor_name")}
        >
          Actor Name
          {queryTable?.sortBy === "actor_name" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "actor_name" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "actor_name" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("action", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("action")}
        >
          Action
          {queryTable?.sortBy === "action" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "action" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "action" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("target_type", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("target_type")}
        >
          Target Type
          {queryTable?.sortBy === "target_type" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "target_type" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "target_type" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("target_id", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("target_id")}
        >
          Target Id
          {queryTable?.sortBy === "terget_id" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "terget_id" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "terget_id" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
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
      columns={columns}
      data={responseData?.data?.data?.items ?? []}
      isLoading={isLoading}
      pageCount={responseData?.data?.data?.meta?.total_page || 1}
      rowCount={responseData?.data?.data?.meta?.total_all_data || 0}
      pageIndex={responseData?.data?.data?.meta?.current_page || 1}
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
            placeholder="Search..."
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
