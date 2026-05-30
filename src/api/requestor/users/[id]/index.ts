import REQUESTOR_API_PATH from "@/api/requestor/_const/path";
import { requestorAxios } from "@/api/requestor/_libs/axios";
import type { AxiosResponse } from "axios";
import type { TRequestorApiResponse } from "@/api/requestor/types/response";
import type { TUserResponse } from "@/api/requestor/users/types/user-response";
import type { TUserUpdatePayload } from "@/api/requestor/users/[id]/types/user-update-payload";

export const getUserById = async (id: string) => {
  const response: AxiosResponse<TRequestorApiResponse<TUserResponse>> =
    await requestorAxios.get(REQUESTOR_API_PATH.USER.DETAIL(id));

  return response;
};

export const updateUserById = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUserUpdatePayload;
}) => {
  const response = await requestorAxios.patch(
    REQUESTOR_API_PATH.USER.DETAIL(id),
    payload,
  );
  return response;
};

export const deleteUserById = async (id: string) => {
  const response = await requestorAxios.delete(
    REQUESTOR_API_PATH.USER.DETAIL(id),
  );

  return response;
};
