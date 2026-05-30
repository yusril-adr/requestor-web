import { type AxiosResponse } from "axios";
import REQUESTOR_API_PATH from "@/api/requestor/_const/path";
import type { TRequestorApiPaginationResponse } from "@/api/requestor/types/response";
import { requestorAxios } from "@/api/requestor/_libs/axios";
import type { TUserResponse } from "./types/user-response";
import type { TUserPaginationPayload } from "./types/user-pagination-payload";
import type { TUserCreatePayload } from "./types/user-create-payload";

export const createUser = async (payload: TUserCreatePayload) => {
  const response = await requestorAxios.post(
    REQUESTOR_API_PATH.USER.DEFAULT,
    payload,
  );

  return response;
};

export const getUserPagination = async (payload: TUserPaginationPayload) => {
  const response: AxiosResponse<
    TRequestorApiPaginationResponse<TUserResponse>
  > = await requestorAxios.get(REQUESTOR_API_PATH.USER.DEFAULT, {
    params: payload,
  });

  return response;
};
