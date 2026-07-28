import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";
import { createUser } from "@/api/main/users";
import type { TUserCreatePayload } from "@/api/main/users/types/user-create-payload";
import CONFIG from "@/common/constants/config";

export function useCreateUser(
  options?: Omit<
    UseMutationOptions<AxiosResponse, Error, TUserCreatePayload>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createUser,
    onMutate: (...args) => {
      toast.loading("Creating user...");
      options?.onMutate?.(...args);
    },
    onSuccess: (...args) => {
      toast.dismiss();
      toast.success("User created");
      queryClient.invalidateQueries({
        queryKey: [CONFIG.QUERY_KEY.MAIN_API.USER.ALL()],
      });
      options?.onSuccess?.(...args);
    },
  });
}
