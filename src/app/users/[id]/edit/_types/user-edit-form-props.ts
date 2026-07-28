import type { TUserUpdatePayload } from "@/api/main/users/[id]/types/user-update-payload";

export type TUserEditFormProps = {
  name: string | undefined;
  email: string | undefined;
  role: string | undefined;
  status: string | undefined;
  isLoading: boolean;
  onSubmitPayload: (payload: TUserUpdatePayload) => void;
  mutationError: Error | null;
  isPending: boolean;
  isPaused: boolean;
};
