import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TAuthProviderState } from "../_types/auth-provider-state";
import type { TAuthProviderProps } from "../_types/auth-provider-props";
import { authMe } from "@/api/requestor/auth/me";
import AccessToken from "@/libs/local-storage/access-token";
import CONFIG from "@/common/constants/config";
import { toast } from "sonner";
import axios from "axios";
import { logout } from "@/utils/logout";

export const AuthProviderContext = createContext<TAuthProviderState>({
  auth: null,
  authQuery: null,
});

export function AuthProvider({ children, ...props }: TAuthProviderProps) {
  const authQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ME()],
    queryFn: authMe,
    enabled: !!AccessToken.get(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const auth = authQuery?.data?.data?.data ?? null;

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
    <AuthProviderContext.Provider {...props} value={{ auth, authQuery }}>
      {children}
    </AuthProviderContext.Provider>
  );
}
