import { useQuery } from "@tanstack/react-query";
import { getRequestPagination } from "@/api/main/requests";
import CONFIG from "@/common/constants/config";
import type { TRequestPaginationPayload } from "@/api/main/requests/types/request-pagination-payload";

export function useGetRequestPagination(payload: TRequestPaginationPayload) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.MAIN_API.REQUEST.ALL(), payload],
    queryFn: () => getRequestPagination(payload),
  });
}
