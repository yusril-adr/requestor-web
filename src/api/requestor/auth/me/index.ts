import { type AxiosResponse } from "axios";
import type { TUserMeResponse } from "./types/user-me-response";
import REQUESTOR_API_PATH from "../../_const/path";
import type { TRequestorApiResponse } from "../../types/response";
import { requestorAxios } from "../../_libs/axios";

export const authMe = async () => {
  const response: AxiosResponse<TRequestorApiResponse<TUserMeResponse>> =
    await requestorAxios.get(REQUESTOR_API_PATH.AUTH.ME);

  return response;
};
