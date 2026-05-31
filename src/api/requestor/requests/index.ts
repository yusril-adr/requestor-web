import { type AxiosResponse } from "axios";
import REQUESTOR_API_PATH from "@/api/requestor/_const/path";
import type { TRequestorApiPaginationResponse } from "@/api/requestor/types/response";
import { requestorAxios } from "@/api/requestor/_libs/axios";
import type { TRequestResponse } from "./types/request-response";
import type { TRequestPaginationPayload } from "./types/request-pagination-payload";
import type { TRequestCreatePayload } from "./types/request-create-payload";

export const createRequest = async (payload: TRequestCreatePayload) => {
  const response = await requestorAxios.post(
    REQUESTOR_API_PATH.REQUEST.DEFAULT,
    payload,
  );

  return response;
};

export const getRequestPagination = async (
  payload: TRequestPaginationPayload,
) => {
  const response: AxiosResponse<
    TRequestorApiPaginationResponse<TRequestResponse>
  > = await requestorAxios.get(REQUESTOR_API_PATH.REQUEST.DEFAULT, {
    params: payload,
  });

  return response;
};
