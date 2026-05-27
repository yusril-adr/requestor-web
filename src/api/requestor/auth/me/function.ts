import { type AxiosResponse } from "axios";
import type { TMeResponse } from "./_types/response";
import REQUESTOR_API_PATH from "../../_const/path";
import type { TRequestorApiResponse } from "../../types/response";
import { requestorAxios } from "../../_libs/axios";

const authMe = async () => {
  const response: AxiosResponse<TRequestorApiResponse<TMeResponse>> =
    await requestorAxios.get(REQUESTOR_API_PATH.AUTH.ME);

  return response;
};

export default authMe;
