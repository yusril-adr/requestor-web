import { createContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { TAuthProviderState } from "../_types/auth-provider-state";
import type { TAuthProviderProps } from "../_types/auth-provider-props";
import { authMe } from "@/api/requestor/auth/me";
import AccessToken from "@/libs/local-storage/access-token";
import CONFIG from "@/common/constants/config";
import { toast } from "sonner";
import axios from "axios";

export const AuthProviderContext = createContext<TAuthProviderState>({
  auth: null,
  authQuery: null,
  logout: () => {},
});

export function AuthProvider({ children, ...props }: TAuthProviderProps) {
  const queryClient = useQueryClient();

  const authQuery = useQuery({
    queryKey: CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ME(),
    queryFn: authMe,
    enabled: !!AccessToken.get(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const auth = authQuery?.data?.data.data ?? null;

  const logout = useCallback(() => {
    AccessToken.remove();
    queryClient.setQueryData(CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ME(), null);
    queryClient.removeQueries({
      queryKey: CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ALL(),
    });
  }, [queryClient]);

  if (authQuery?.isError && axios.isAxiosError(authQuery.error)) {
    const statusCode = authQuery.error.response?.status;
    if (statusCode === 401) {
      logout();
    }
  }

  if (authQuery?.isError) {
    toast.error(authQuery.error.message);
  }

  return (
    <AuthProviderContext.Provider
      {...props}
      value={{ auth, authQuery, logout }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}
