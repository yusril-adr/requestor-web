import axios from "axios";
import CONFIG from "@/common/constants/config";
import AccessToken from "@/libs/local-storage/access-token";
import { toast } from "sonner";
import type { TMainApiResponse } from "../types/response";
import MainAPINotFoundError from "../errors/not-found-error";
import MainAPIValidationError from "../errors/validation-error";
import { logout } from "@/utils/logout";

export const mainAxios = axios.create({
  baseURL: CONFIG.MAIN_API_BASE_URL,
});

mainAxios.interceptors.request.use((config) => {
  const token = AccessToken.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

mainAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;

      const defaultErrorResponse = error.response
        ?.data as TMainApiResponse<null>;

      toast.dismiss();
      switch (statusCode) {
        case 400: {
          const validationErrorResponse = error.response
            ?.data as TMainApiResponse<null>;

          if (Array.isArray(validationErrorResponse.message)) {
            throw new MainAPIValidationError(
              validationErrorResponse.message,
            );
          } else {
            toast.error(defaultErrorResponse.message as string);
          }
          break;
        }

        case 401: {
          toast.error(defaultErrorResponse.message as string);
          logout();
          break;
        }
        case 404: {
          toast.error(defaultErrorResponse.message as string);
          throw new MainAPINotFoundError(
            defaultErrorResponse.message as string,
          );
        }
        default: {
          toast.error(defaultErrorResponse.message as string);
          break;
        }
      }
    }
    return Promise.reject(error);
  },
);
