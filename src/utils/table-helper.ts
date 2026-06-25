import type { TTablePageVisibility } from "@/app/_types/table-page-visibility";

export function generatePages({
  currentPage,
  totalPages,
  visiblePages = 5,
}: TTablePageVisibility) {
  // prevent visiblePages > totalPages
  const maxVisible = Math.min(visiblePages, totalPages);

  // center current page
  let start = currentPage - Math.floor(maxVisible / 2);

  let end = start + maxVisible - 1;

  // fix start underflow
  if (start < 1) {
    start = 1;
    end = maxVisible;
  }

  // fix end overflow
  if (end > totalPages) {
    start = totalPages - maxVisible + 1;
  }

  return Array.from({ length: maxVisible }, (_, i) => start + i);
}
