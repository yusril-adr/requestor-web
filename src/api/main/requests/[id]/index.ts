import MAIN_API_PATH from "@/api/main/_const/path";
import { mainAxios } from "@/api/main/_libs/axios";
import type { AxiosResponse } from "axios";
import type { TMainApiResponse } from "@/api/main/types/response";
import type { TRequestResponse } from "@/api/main/requests/types/request-response";
import type { TRequestUpdatePayload } from "@/api/main/requests/[id]/types/request-update-payload";

export const getRequestById = async (id: string) => {
  const response: AxiosResponse<TMainApiResponse<TRequestResponse>> =
    await mainAxios.get(MAIN_API_PATH.REQUEST.DETAIL(id));

  return response;
};

export const updateRequestById = async ({
  id,
  payload,
}: {
  id: string;
  payload: TRequestUpdatePayload;
}) => {
  const response = await mainAxios.patch(
    MAIN_API_PATH.REQUEST.DETAIL(id),
    payload,
  );
  return response;
};

export const deleteRequestById = async (id: string) => {
  const response = await mainAxios.delete(
    MAIN_API_PATH.REQUEST.DETAIL(id),
  );

  return response;
};
