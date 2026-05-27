import type { TRequestorApiResponse } from "@/api/requestor/_types/response";
import type { TUser } from "@/api/requestor/_types/user";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export type TAuthProviderState = {
  auth: TUser | null;
  setAuth: (auth: TUser | null) => void;
  authMutation: UseMutationResult<
    AxiosResponse<TRequestorApiResponse<TUser>>,
    Error,
    void
  > | null;
  clearAuth: () => void;
};
