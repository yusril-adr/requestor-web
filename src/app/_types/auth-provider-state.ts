import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { TUserMeResponse } from "@/api/requestor/auth/me/types/user-me-response";
import type { TRequestorApiResponse } from "@/api/requestor/types/response";

export type TAuthProviderState = {
  auth: TUserMeResponse | null;
  authQuery: UseQueryResult<
    NoInfer<AxiosResponse<TRequestorApiResponse<TUserMeResponse>, any, {}>>,
    Error
  > | null;
  logout: () => void;
};
