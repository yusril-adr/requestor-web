import type { TRequestCreatePayload } from "@/api/requestor/requests/types/request-create-payload";

export type TRequestCreateFormProps = {
  onSubmitPayload: (payload: TRequestCreatePayload) => void;
  mutationError: Error | null;
  isPending: boolean;
  isPaused: boolean;
};
