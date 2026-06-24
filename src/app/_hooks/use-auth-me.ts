import { useQuery } from "@tanstack/react-query";
import { authMe } from "@/api/requestor/auth/me";
import CONFIG from "@/common/constants/config";

export function useAuthMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ME()],
    queryFn: authMe,
    enabled: options?.enabled,
  });
}
