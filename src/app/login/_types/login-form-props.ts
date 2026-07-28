import type { TLoginPayload } from "@/api/main/auth/login/types/login-payload";

export type TLoginFormProps = {
  onSubmitPayload: (payload: TLoginPayload) => void;
  mutationError: Error | null;
  isPending: boolean;
  isPaused: boolean;
};
