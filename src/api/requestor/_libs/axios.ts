import axios from "axios";
import CONFIG from "@/common/constants/config";
import AccessToken from "@/libs/local-storage/access-token";

export const requestorAxios = axios.create({
  baseURL: CONFIG.REQUESTOR_API_BASE_URL,
});

requestorAxios.interceptors.request.use((config) => {
  const token = AccessToken.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
