import type { TUserCreatePayload } from "@/api/main/users/types/user-create-payload";

export type TUserCreateFormProps = {
  onSubmitPayload: (payload: TUserCreatePayload) => void;
  mutationError: Error | null;
  isPending: boolean;
  isPaused: boolean;
};
