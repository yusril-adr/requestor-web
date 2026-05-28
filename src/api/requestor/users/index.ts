import { type AxiosResponse } from "axios";
import REQUESTOR_API_PATH from "@/api/requestor/_const/path";
import type { TRequestorApiResponse } from "@/api/requestor/types/response";
import { requestorAxios } from "@/api/requestor/_libs/axios";
import type { TUserResponse } from "./types/user-response";
import type { TUserPaginationPayload } from "./types/user-pagination-payload";

export const getUserPagination = async (payload: TUserPaginationPayload) => {
  const response: AxiosResponse<TRequestorApiResponse<TUserResponse>> =
    await requestorAxios.get(REQUESTOR_API_PATH.USER.DEFAULT, {
      params: payload,
    });

  return response;
};
