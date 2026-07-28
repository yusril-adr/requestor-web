import { type AxiosResponse } from "axios";
import MAIN_API_PATH from "@/api/main/_const/path";
import type { TMainApiPaginationResponse } from "@/api/main/types/response";
import { mainAxios } from "@/api/main/_libs/axios";
import type { TUserResponse } from "./types/user-response";
import type { TUserPaginationPayload } from "./types/user-pagination-payload";
import type { TUserCreatePayload } from "./types/user-create-payload";

export const createUser = async (payload: TUserCreatePayload) => {
  const response = await mainAxios.post(
    MAIN_API_PATH.USER.DEFAULT,
    payload,
  );

  return response;
};

export const getUserPagination = async (payload: TUserPaginationPayload) => {
  const response: AxiosResponse<
    TMainApiPaginationResponse<TUserResponse>
  > = await mainAxios.get(MAIN_API_PATH.USER.DEFAULT, {
    params: payload,
  });

  return response;
};
