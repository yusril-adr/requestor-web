import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { updateRequestById } from "@/api/requestor/requests/[id]";
import type { TRequestUpdatePayload } from "@/api/requestor/requests/[id]/types/request-update-payload";
import CONFIG from "@/common/constants/config";

export function useUpdateRequestById(
  options?: Omit<
    UseMutationOptions<
      AxiosResponse,
      Error,
      { id: string; payload: TRequestUpdatePayload }
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRequestById,
    onMutate: (...args) => {
      toast.loading("Updating request...");
      options?.onMutate?.(...args);
    },
    onSuccess: (...args) => {
      toast.dismiss();
      toast.success("Request updated.");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL()],
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}
