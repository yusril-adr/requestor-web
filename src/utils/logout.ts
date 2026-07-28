import CONFIG from "@/common/constants/config";
import AccessToken from "@/libs/local-storage/access-token";
import { globalQueryClient } from "@/libs/react-query/global-query-client";

export function logout() {
  AccessToken.remove();
  globalQueryClient.setQueryData(
    [CONFIG.QUERY_KEY.MAIN_API.AUTH.ME()],
    null,
  );
  globalQueryClient.removeQueries({
    queryKey: [CONFIG.QUERY_KEY.MAIN_API.AUTH.ALL()],
  });
}
