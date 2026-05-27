import { createContext, useState } from "react";
import type { TAuthProviderState } from "../_types/auth-provider-state";
import type { TAuthProviderProps } from "../_types/auth-provider-props";
import type { TUser } from "@/api/requestor/_types/user";
import { useMutation } from "@tanstack/react-query";
import authMe from "@/api/requestor/auth/me/function";
import CONFIG from "@/common/constants/config";

export const AuthProviderContext = createContext<TAuthProviderState>({
  auth: null,
  setAuth: () => null,
  authMutation: null,
  clearAuth: () => null,
});

export function AuthProvider({ children, ...props }: TAuthProviderProps) {
  const [auth, setAuth] = useState<TUser | null>(null);
  const authMutation = useMutation({
    mutationKey: CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ME(),
    mutationFn: authMe,
    onSuccess: (response) => {
      const responseData = response.data.data;

      setAuth(responseData);
    },
  });

  const clearAuth = () => {
    setAuth(null);
  };

  const value = {
    auth,
    setAuth,
    authMutation,
    clearAuth,
  };

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}
