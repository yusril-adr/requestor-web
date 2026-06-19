import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  EllipsisVertical,
  Eye,
  Funnel,
  Pencil,
  Search,
  Trash,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
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
import { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";
import CONFIG from "@/common/constants/config";
import type { TRequestPaginationPayload } from "@/api/requestor/requests/types/request-pagination-payload";
import { getRequestPagination } from "@/api/requestor/requests";
import type { TRequestSortBy } from "@/api/requestor/requests/consts/request-sort-by";
import type { TRequestTableCol } from "@/app/requests/_types/request-table-col";

import type { TRequestorApiErrorResponse } from "@/api/requestor/types/response";
import { useAuth } from "@/app/_hooks/use-auth";
import { useFilter } from "@/app/_hooks/use-filter";
import {
  DataTable,
  DataTableSortableColHeader,
} from "@/app/_components/data-table";
import { deleteRequestById } from "@/api/requestor/requests/[id]";
import { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";
import { RoleKeyEnum } from "@/common/enums/role-key";
import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";
import RequestorAPIValidationError from "@/api/requestor/errors/validation-error";
import { applyValidationErrors } from "@/utils/validation-helper";

type TRequestTableFilterValues = {
  status: string | null;
  priority: string | null;
};

let debounceSearchTimeoutId: number | null = null;

export default function RequestTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [confirmatedDeletedId, setConfirmatedDeletedId] = useState<
    string | null
  >(null);

  const queryTable = useMemo(
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
        status: (queryTable?.status as RequestStatusEnum) || null,
        priority: (queryTable?.priority as RequestPriorityEnum) || null,
      },
    });

  const { onFilterReset, onFilterSubmit, columnFilters, filterParams } =
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
      queryTable,
      setSearchParams,
      reset,
    );

  const { mutate: deleteRequestMutate } = useMutation({
    mutationFn: deleteRequestById,
    onMutate: () => {
      toast.loading("Deleting request...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Request deleted");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL()],
      });
    },
    onError: (error) => {
      if (error instanceof RequestorAPIValidationError) {
        return applyValidationErrors(
          setError,
          error.errors as TRequestorApiErrorResponse<null>[],
        );
      }

      if (error instanceof RequestorAPINotFoundError) {
        navigate("/requests");
        return;
      }
    },
  });

  const onDeleteHandler = useCallback(() => {
    if (confirmatedDeletedId) {
      deleteRequestMutate(confirmatedDeletedId);
    }

    setConfirmatedDeletedId(null);
  }, [confirmatedDeletedId, deleteRequestMutate]);

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

  const mappedQueryTablePayload: TRequestPaginationPayload = useMemo(
    () => ({
      page: queryTable.page,
      per_page: queryTable.pageSize,
      search: queryTable.search,
      sort_by: queryTable.sortBy as TRequestSortBy,
      order: queryTable.order as OrderKeyEnum,
      ...filterParams,
    }),
    [queryTable, filterParams],
  );

  const {
    data: responseData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL(),
      mappedQueryTablePayload,
    ],
    queryFn: () => getRequestPagination(mappedQueryTablePayload),
  });

  useEffect(() => {
    if (isError && error && error instanceof RequestorAPINotFoundError) {
      navigate("/requests");
      return;
    }
  }, [isError, error]);

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

  const allowedActionRoles = [RoleKeyEnum.ADMIN, RoleKeyEnum.OPERATOR];

  const columnHelper = createColumnHelper<TRequestTableCol>();
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

    columnHelper.accessor("title", {
      header: () => (
        <DataTableSortableColHeader
          label="Name"
          sortKey="title"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("title")}
        />
      ),
      cell: ({ row }) => {
        const rowOriginal = row.original;
        return (
          <Button
            variant="link"
            render={<Link to={`/requests/${rowOriginal.id}`} />}
            nativeButton={false}
          >
            {rowOriginal.title}
          </Button>
        );
      },
    }),

    columnHelper.accessor("requestor_name", {
      header: () => (
        <DataTableSortableColHeader
          label="Requestor Name"
          sortKey="requestor_name"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("requestor_name")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
      header: () => (
        <DataTableSortableColHeader
          label="Status"
          sortKey="status"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("status")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("priority", {
      header: () => (
        <DataTableSortableColHeader
          label="Priority"
          sortKey="priority"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("priority")}
        />
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("assignee_name", {
      header: () => (
        <DataTableSortableColHeader
          label="Assignee Name"
          sortKey="assignee_name"
          sortBy={queryTable?.sortBy}
          order={queryTable?.order}
          onClick={() => applySorting("assignee_name")}
        />
      ),
      cell: (info) => info.getValue() ?? "-",
    }),

    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const currentRole = auth?.role || RoleKeyEnum.VIEWER;
        const rowOriginal = row.original;

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
                <DropdownMenuItem
                  render={<Link to={`/requests/${rowOriginal.id}`} />}
                >
                  <Eye />
                  View
                </DropdownMenuItem>
                {allowedActionRoles.includes(currentRole) && (
                  <DropdownMenuItem
                    render={<Link to={`/requests/${rowOriginal.id}/edit`} />}
                  >
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                )}
                {allowedActionRoles.includes(currentRole) && (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setConfirmatedDeletedId(rowOriginal.id)}
                  >
                    <Trash />
                    Delete{" "}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

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
    <>
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
                          items={Object.values(RequestStatusEnum)}
                          onValueChange={(value) => {
                            field.onChange(value === "" ? undefined : value);
                          }}
                          {...field}
                        >
                          <ComboboxInput
                            placeholder="Select status"
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

                  <Controller
                    name="priority"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="grid gap-2"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="priority">Priority</FieldLabel>
                        <Combobox
                          id="priority"
                          items={Object.values(RequestPriorityEnum)}
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <ComboboxInput
                            placeholder="Select priority"
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
            <AlertDialogAction onClick={onDeleteHandler}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
