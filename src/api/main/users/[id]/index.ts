import MAIN_API_PATH from "@/api/main/_const/path";
import { mainAxios } from "@/api/main/_libs/axios";
import type { AxiosResponse } from "axios";
import type { TMainApiResponse } from "@/api/main/types/response";
import type { TUserResponse } from "@/api/main/users/types/user-response";
import type { TUserUpdatePayload } from "@/api/main/users/[id]/types/user-update-payload";

export const getUserById = async (id: string) => {
  const response: AxiosResponse<TMainApiResponse<TUserResponse>> =
    await mainAxios.get(MAIN_API_PATH.USER.DETAIL(id));

  return response;
};

export const updateUserById = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUserUpdatePayload;
}) => {
  const response = await mainAxios.patch(
    MAIN_API_PATH.USER.DETAIL(id),
    payload,
  );
  return response;
};

export const deleteUserById = async (id: string) => {
  const response = await mainAxios.delete(
    MAIN_API_PATH.USER.DETAIL(id),
  );

  return response;
};
