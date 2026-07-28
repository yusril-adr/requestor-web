import { type AxiosResponse } from "axios";
import type { TLoginPayload } from "./types/login-payload";
import type { TLoginResponse } from "./types/login-response";
import MAIN_API_PATH from "../../_const/path";
import type { TMainApiResponse } from "../../types/response";
import { mainAxios } from "../../_libs/axios";

export const login = async (payload: TLoginPayload) => {
  const response: AxiosResponse<TMainApiResponse<TLoginResponse>> =
    await mainAxios.post(MAIN_API_PATH.AUTH.LOGIN, payload);

  return response;
};
