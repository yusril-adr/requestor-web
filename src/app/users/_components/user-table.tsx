import { useCallback, useMemo } from "react";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Eye,
  Funnel,
  Pencil,
  Search,
  Trash,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

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
import { RoleKeyEnum } from "@/common/enums/role-key";
import { UserStatusEnum } from "@/api/requestor/users/enums/user-status";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { ButtonGroup } from "@/app/_components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Skeleton } from "@/app/_components/ui/skeleton";

import { OrderKeyEnum } from "@/common/enums/order-key";
import CONFIG from "@/common/constants/config";
import type { TUserPaginationPayload } from "@/api/requestor/users/types/user-pagination-payload";
import { getUserPagination } from "@/api/requestor/users";
import type { TUserSortBy } from "@/api/requestor/users/consts/user-sort-by";
import type { TUserTableCol } from "@/app/users/_types/user-table-col";
import { generatePages } from "@/utils/table-helper";
import {
  UserTableFilterSchema,
  type TUserTableFilterSchema,
} from "@/app/users/_schema/user-table-filter";
import { toast } from "sonner";
import axios from "axios";
import type { TRequestorApiResponse } from "@/api/requestor/types/response";
import { useAuth } from "@/app/_hooks/use-auth";

let debounceSearchTimeoutId: number | null = null;

export default function UserTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();

  const queryTable = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("page_size") || 10),
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sort_by") || undefined,
      order: searchParams.get("order") || undefined,
      status: searchParams.get("status") || undefined,
      role: searchParams.get("role") || undefined,
    }),
    [searchParams],
  );

  const { control, handleSubmit, reset } = useForm<TUserTableFilterSchema>({
    resolver: zodResolver(UserTableFilterSchema),
    defaultValues: {
      status: queryTable?.status as UserStatusEnum | undefined,
      role: queryTable?.role as RoleKeyEnum | undefined,
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

  const onFilterSubmit: SubmitHandler<TUserTableFilterSchema> = (data) => {
    setSearchParams((searchParams) => {
      searchParams.set("status", data.status || "");

      searchParams.set("role", data.role || "");

      searchParams.set("page", "1");

      return searchParams;
    });
  };

  const onFilterReset = () => {
    reset({
      status: null,
      role: null,
    });
  };

  const mappedQueryTablePayload: TUserPaginationPayload = useMemo(
    () => ({
      page: queryTable.page,
      per_page: queryTable.pageSize,
      search: queryTable.search,
      sort_by: queryTable.sortBy as TUserSortBy,
      order: queryTable.order as OrderKeyEnum,
      status: queryTable.status as UserStatusEnum,
      role: queryTable.role as RoleKeyEnum,
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
      CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL,
      mappedQueryTablePayload,
    ],
    queryFn: () => getUserPagination(mappedQueryTablePayload),
  });

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

  const jumpPage = useCallback(
    (page: number) => {
      setSearchParams((searchParams) => {
        searchParams.set("page", page.toString());
        return searchParams;
      });
    },
    [searchParams],
  );

  const isFirstPage = useMemo(() => queryTable?.page === 1, [queryTable?.page]);
  const prevPage = useCallback(() => {
    jumpPage((queryTable?.page || 1) - 1);
  }, [queryTable?.page, jumpPage]);

  const isLastPage = useMemo(
    () => queryTable?.page === responseData?.data?.data?.meta?.total_page,
    [queryTable?.page, responseData?.data?.data?.meta?.total_page],
  );
  const nextPage = useCallback(() => {
    jumpPage((queryTable?.page || 1) + 1);
  }, [queryTable?.page, jumpPage]);

  const setPageSize = useCallback(
    (pageSize: number) => {
      setSearchParams((searchParams) => {
        searchParams.set("page_size", pageSize.toString());
        searchParams.set("page", "1");
        return searchParams;
      });
    },
    [searchParams],
  );

  const columnHelper = createColumnHelper<TUserTableCol>();
  const columns = [
    columnHelper.display({
      id: "no",
      header: "No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        return pageIndex + row.index + 1;
      },
    }),

    columnHelper.accessor("name", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("name")}
        >
          Name
          {queryTable?.sortBy === "name" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "name" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "name" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("email", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("email")}
        >
          Email
          {queryTable?.sortBy === "email" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "email" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "email" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("role", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("role")}
        >
          Role
          {queryTable?.sortBy === "role" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "role" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "role" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
      header: () => (
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0"
          onClick={() => applySorting("status")}
        >
          Status
          {queryTable?.sortBy === "status" &&
            queryTable?.order === OrderKeyEnum.ASC &&
            ascIcon}
          {queryTable?.sortBy === "status" &&
            queryTable?.order === OrderKeyEnum.DESC &&
            descIcon}
          {queryTable?.sortBy !== "status" && <ArrowUpDown />}
        </Button>
      ),
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const user = row.original;

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
                <DropdownMenuItem render={<Link to={`/users/${user.id}`} />}>
                  <Eye />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link to={`/users/${user.id}/edit`} />}
                >
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters = [];
    if (queryTable?.status) {
      filters.push({
        id: "status",
        value: queryTable?.status as UserStatusEnum,
      });
    }

    if (queryTable?.role) {
      filters.push({
        id: "role",
        value: queryTable?.role as RoleKeyEnum,
      });
    }

    return filters;
  }, [queryTable?.status, queryTable?.role]);

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

  const tableOptions = useMemo(
    () => ({
      data: responseData?.data?.data?.items ?? [],
      columns,
      pageCount: responseData?.data?.data?.meta?.total_page || 1,
      rowCount: responseData?.data?.data?.meta?.total_all_data || 0,
      state: {
        pagination: {
          pageIndex:
            ((responseData?.data?.data?.meta?.current_page || 1) - 1) *
              (responseData?.data?.data?.meta?.total_view || 1) || 0,
          pageSize: responseData?.data?.data?.meta?.max_view || 10,
        },
        columnFilters,
        sorting,
      },
      getCoreRowModel: getCoreRowModel(),
      debugTable: true,
    }),
    [responseData],
  );

  const table = useReactTable(tableOptions);

  const { pageIndex, pageSize } = table.getState().pagination;

  const longestColumnCount = Math.max(
    ...table.getHeaderGroups().map((group) => group.headers.length),
  );
  const isLoadingColElement = Array.from({
    length: pageSize || 10,
  }).map((_, idx) => (
    <TableRow key={idx}>
      {Array.from({ length: longestColumnCount }).map((_, cellIdx) => (
        <TableCell key={cellIdx}>
          <Skeleton className="h-7" />
        </TableCell>
      ))}
    </TableRow>
  ));

  const indexStart = pageIndex + 1;

  const indexEnd = Math.min((pageIndex + 1) * pageSize, table.getRowCount());

  const pages = generatePages({
    currentPage: pageIndex / pageSize + 1,
    totalPages: responseData?.data?.data?.meta?.total_page || 1,
  });

  const pageSizeOptions = [
    {
      label: "5 / page",
      value: "5",
    },
    {
      label: "10 / page",
      value: "10",
    },
    {
      label: "20 / page",
      value: "20",
    },
    {
      label: "50 / page",
      value: "50",
    },
    {
      label: "100 / page",
      value: "100",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
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
                  name="role"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field
                      className="grid gap-2"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="role">Role</FieldLabel>
                      <Combobox
                        id="role"
                        items={Object.values(RoleKeyEnum)}
                        onValueChange={field.onChange}
                        {...field}
                      >
                        <ComboboxInput placeholder="Select role" showClear />
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
                        items={Object.values(UserStatusEnum)}
                        onValueChange={(value) => {
                          field.onChange(value === "" ? undefined : value);
                        }}
                        {...field}
                      >
                        <ComboboxInput placeholder="Select role" showClear />
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
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {!isLoading &&
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

            {isLoading && isLoadingColElement}
          </TableBody>
        </Table>

        {!isLoading && (
          <div className="flex flex-col md:flex-row justify-end items-center gap-2">
            <span>
              {indexStart} - {indexEnd} of {indexEnd} items
            </span>

            <ButtonGroup>
              <Button
                variant="ghost"
                size="icon"
                disabled={isFirstPage}
                onClick={prevPage}
              >
                <ChevronLeft />
              </Button>

              {pages.map((page) => (
                <Button
                  key={page}
                  variant="ghost"
                  size="icon"
                  disabled={page === pageIndex / pageSize + 1}
                  onClick={() => jumpPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="icon"
                disabled={isLastPage}
                onClick={nextPage}
              >
                <ChevronRight />
              </Button>
            </ButtonGroup>

            <Select
              items={pageSizeOptions}
              value={pageSize.toString()}
              onValueChange={(val) =>
                setPageSize(parseInt(val || pageSize.toString()))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {pageSizeOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
