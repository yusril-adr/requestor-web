import { useQuery } from "@tanstack/react-query";
import { authMe } from "@/api/main/auth/me";
import CONFIG from "@/common/constants/config";

export function useAuthMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.MAIN_API.AUTH.ME()],
    queryFn: authMe,
    enabled: options?.enabled,
  });
}
