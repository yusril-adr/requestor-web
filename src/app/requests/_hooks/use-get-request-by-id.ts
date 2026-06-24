import { useQuery } from "@tanstack/react-query";
import { getRequestById } from "@/api/requestor/requests/[id]";
import CONFIG from "@/common/constants/config";

export function useGetRequestById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL(), id],
    queryFn: () => getRequestById(id),
    enabled: options?.enabled ?? !!id,
  });
}
