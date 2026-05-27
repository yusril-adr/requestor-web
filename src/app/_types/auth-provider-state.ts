import type { TRequestorApiResponse } from "@/api/requestor/_types/response";
import type { TUser } from "@/api/requestor/_types/user";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export type TAuthProviderState = {
  auth: TUser | null;
  authQuery: UseQueryResult<
    NoInfer<AxiosResponse<TRequestorApiResponse<TUser>, any, {}>>,
    Error
  > | null;
  logout: () => void;
};
