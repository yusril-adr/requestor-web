import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { createUser } from "@/api/requestor/users";
import type { TUserCreatePayload } from "@/api/requestor/users/types/user-create-payload";
import CONFIG from "@/common/constants/config";

export function useCreateUser(
  options?: Omit<
    UseMutationOptions<AxiosResponse, Error, TUserCreatePayload>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onMutate: (...args) => {
      toast.loading("Creating user...");
      options?.onMutate?.(...args);
    },
    onSuccess: (...args) => {
      toast.dismiss();
      toast.success("User created");
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
