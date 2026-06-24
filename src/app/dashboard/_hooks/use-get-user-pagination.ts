import { useQuery } from "@tanstack/react-query";
import { getUserPagination } from "@/api/requestor/users";
import CONFIG from "@/common/constants/config";
import type { TUserPaginationPayload } from "@/api/requestor/users/types/user-pagination-payload";

export function useGetUserPagination(payload: TUserPaginationPayload) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL(), payload],
    queryFn: () => getUserPagination(payload),
  });
}
