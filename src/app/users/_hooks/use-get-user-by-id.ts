import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/main/users/[id]";
import CONFIG from "@/common/constants/config";

export function useGetUserById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.MAIN_API.USER.ALL(), id],
    queryFn: () => getUserById(id),
    enabled: options?.enabled ?? !!id,
  });
}
