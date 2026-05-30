import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type TableOptions,
  type ColumnDefBase,
  type StringHeaderIdentifier,
  type IdIdentifier,
  type AccessorKeyColumnDefBase,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import { ButtonGroup } from "@/app/_components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { generatePages } from "@/utils/table-helper";

const PAGE_SIZE_OPTIONS = [
  { label: "5 / page", value: 5 },
  { label: "10 / page", value: 10 },
  { label: "20 / page", value: 20 },
  { label: "50 / page", value: 50 },
  { label: "100 / page", value: 100 },
];

export interface DataTableProps<TData> {
  columns: (
    | (ColumnDefBase<TData, unknown> & StringHeaderIdentifier)
    | (ColumnDefBase<TData, unknown> & IdIdentifier<TData, unknown>)
    | (AccessorKeyColumnDefBase<TData, string> &
        Partial<IdIdentifier<TData, string>>)
  )[];

  data: TData[];
  isLoading?: boolean;
  pageCount: number;
  rowCount: number;
  pageIndex: number;
  pageSize: number;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  children?: React.ReactNode;
  tableOptions?: Omit<
    Partial<TableOptions<TData>>,
    "data" | "columns" | "pageCount" | "getCoreRowModel"
  >;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  pageCount,
  rowCount,
  pageIndex,
  pageSize,
  sorting,
  columnFilters,
  onPageChange,
  onPageSizeChange,
  children,
  tableOptions,
}: DataTableProps<TData>) {
  const { state: tableOptionsState, ...restTableOptions } = tableOptions ?? {};
  const totalRowInCurrentPage = data.length;

  const dataStartIndex = useMemo(
    () => (pageIndex - 1) * pageSize || 0,
    [pageIndex, pageSize],
  );

  const tableState = useMemo(
    () => ({
      pagination: { pageIndex, pageSize },
      sorting,
      columnFilters,
      ...tableOptionsState,
    }),
    [pageIndex, pageSize, sorting, columnFilters, tableOptionsState],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    state: tableState,
    ...restTableOptions,
  });

  const pages = generatePages({
    currentPage: pageIndex,
    totalPages: pageCount,
  });

  const indexStart = rowCount === 0 ? 0 : dataStartIndex + 1;
  const indexEnd = Math.min(dataStartIndex + totalRowInCurrentPage, rowCount);
  const isFirstPage = pageIndex === 1;
  const isLastPage = pageIndex === pageCount;

  const columnCount =
    table.getHeaderGroups().at(0)?.headers.length ?? columns.length;

  return (
    <div className="flex flex-col gap-4">
      {children}

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
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {isLoading &&
              Array.from({ length: pageSize || 10 }).map((_, idx) => (
                <TableRow key={idx}>
                  {Array.from({ length: columnCount }).map((_, cellIdx) => (
                    <TableCell key={cellIdx}>
                      <Skeleton className="h-7" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {!isLoading && (
          <div className="flex flex-col md:flex-row justify-end items-center gap-2">
            <span>
              {indexStart} - {indexEnd} of {rowCount} items
            </span>

            <ButtonGroup>
              <Button
                variant="ghost"
                size="icon"
                disabled={isFirstPage}
                onClick={() => onPageChange?.(pageIndex - 1)}
              >
                <ChevronLeft />
              </Button>

              {pages.map((page) => (
                <Button
                  key={page}
                  variant="ghost"
                  size="icon"
                  disabled={page === pageIndex}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="icon"
                disabled={isLastPage}
                onClick={() => onPageChange?.(pageIndex + 1)}
              >
                <ChevronRight />
              </Button>
            </ButtonGroup>

            <Select
              items={PAGE_SIZE_OPTIONS}
              value={pageSize}
              onValueChange={(val) => onPageSizeChange?.(val || pageSize)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PAGE_SIZE_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value.toString()}>
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
