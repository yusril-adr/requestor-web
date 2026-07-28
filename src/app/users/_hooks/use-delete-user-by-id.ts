import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { deleteUserById } from "@/api/main/users/[id]";
import CONFIG from "@/common/constants/config";

export function useDeleteUserById(
  options?: Omit<
    UseMutationOptions<AxiosResponse, Error, string>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteUserById,
    onMutate: (...args) => {
      toast.loading("Deleting user...");
      options?.onMutate?.(...args);
    },
    onSuccess: (...args) => {
      toast.dismiss();
      toast.success("User deleted");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.MAIN_API.USER.ALL()],
      });
      options?.onSuccess?.(...args);
    },
  });
}
