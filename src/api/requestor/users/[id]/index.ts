import REQUESTOR_API_PATH from "@/api/requestor/_const/path";
import { requestorAxios } from "@/api/requestor/_libs/axios";

export const deleteUserById = async (id: string) => {
  const response = await requestorAxios.delete(
    REQUESTOR_API_PATH.USER.DETAIL(id),
  );

  return response;
};
