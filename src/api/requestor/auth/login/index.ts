import { type AxiosResponse } from "axios";
import type { TLoginPayload } from "./types/login-payload";
import type { TLoginResponse } from "./types/login-response";
import REQUESTOR_API_PATH from "../../_const/path";
import type { TRequestorApiResponse } from "../../types/response";
import { requestorAxios } from "../../_libs/axios";

export const login = async (payload: TLoginPayload) => {
  const response: AxiosResponse<TRequestorApiResponse<TLoginResponse>> =
    await requestorAxios.post(REQUESTOR_API_PATH.AUTH.LOGIN, payload);

  return response;
};
