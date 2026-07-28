import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { deleteRequestById } from "@/api/main/requests/[id]";
import CONFIG from "@/common/constants/config";

export function useDeleteRequestById(
  options?: Omit<
    UseMutationOptions<AxiosResponse, Error, string>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteRequestById,
    onMutate: (...args) => {
      toast.loading("Deleting request...");
      options?.onMutate?.(...args);
    },
    onSuccess: (...args) => {
      toast.dismiss();
      toast.success("Request deleted");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.MAIN_API.REQUEST.ALL()],
      });
      options?.onSuccess?.(...args);
    },
  });
}
