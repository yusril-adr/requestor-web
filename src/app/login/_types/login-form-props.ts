import type { TLoginPayload } from "@/api/requestor/auth/login/types/login-payload";

export type TLoginFormProps = {
  onSubmitPayload: (payload: TLoginPayload) => void;
  mutationError: Error | null;
  isPending: boolean;
  isPaused: boolean;
};
