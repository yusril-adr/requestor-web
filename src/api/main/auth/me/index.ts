import { type AxiosResponse } from "axios";
import type { TUserMeResponse } from "./types/user-me-response";
import MAIN_API_PATH from "../../_const/path";
import type { TMainApiResponse } from "../../types/response";
import { mainAxios } from "../../_libs/axios";

export const authMe = async () => {
  const response: AxiosResponse<TMainApiResponse<TUserMeResponse>> =
    await mainAxios.get(MAIN_API_PATH.AUTH.ME);

  return response;
};
