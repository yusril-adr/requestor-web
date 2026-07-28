import { useQuery } from "@tanstack/react-query";
import { getUserPagination } from "@/api/main/users";
import CONFIG from "@/common/constants/config";
import type { TUserPaginationPayload } from "@/api/main/users/types/user-pagination-payload";

export function useGetUserPagination(payload: TUserPaginationPayload) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.MAIN_API.USER.ALL(), payload],
    queryFn: () => getUserPagination(payload),
  });
}
