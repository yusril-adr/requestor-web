import type { TUserCreatePayload } from "@/api/requestor/users/types/user-create-payload";

export type TUserCreateFormProps = {
  onSubmitPayload: (payload: TUserCreatePayload) => void;
  mutationError: Error | null;
  isPending: boolean;
  isPaused: boolean;
};
