import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { updateUserById } from "@/api/requestor/users/[id]";
import type { TUserUpdatePayload } from "@/api/requestor/users/[id]/types/user-update-payload";
import CONFIG from "@/common/constants/config";

export function useUpdateUserById(
  options?: Omit<
    UseMutationOptions<
      AxiosResponse,
      Error,
      { id: string; payload: TUserUpdatePayload }
    >,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserById,
    onMutate: (...args) => {
      toast.loading("Updating user...");
      options?.onMutate?.(...args);
    },
    onSuccess: (...args) => {
      toast.dismiss();
      toast.success("User updated");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL()],
      });
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      options?.onError?.(...args);
    },
  });
}
