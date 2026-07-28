import type { TRequestUpdatePayload } from "@/api/main/requests/[id]/types/request-update-payload";

export type TRequestEditFormProps = {
  title: string | undefined;
  requestorName: string | undefined;
  assigneeName: string | null | undefined;
  status: string | undefined;
  priority: string | undefined;
  isLoading: boolean;
  onSubmitPayload: (payload: TRequestUpdatePayload) => void;
  mutationError: Error | null;
  isPending: boolean;
  isPaused: boolean;
};
