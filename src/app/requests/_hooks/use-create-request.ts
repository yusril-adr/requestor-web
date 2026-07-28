import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { createRequest } from "@/api/main/requests";
import type { TRequestCreatePayload } from "@/api/main/requests/types/request-create-payload";
import CONFIG from "@/common/constants/config";

export function useCreateRequest(
  options?: Omit<
    UseMutationOptions<AxiosResponse, Error, TRequestCreatePayload>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createRequest,
    onMutate: (...args) => {
      toast.loading("Creating request...");
      options?.onMutate?.(...args);
    },
    onSuccess: (...args) => {
      toast.dismiss();
      toast.success("Request created");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.MAIN_API.REQUEST.ALL()],
      });
      options?.onSuccess?.(...args);
    },
  });
}
