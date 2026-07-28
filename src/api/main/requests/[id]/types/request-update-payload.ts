import type { TRequestCreatePayload } from "@/api/main/requests/types/request-create-payload";
import { RequestStatusEnum } from "@/api/main/requests/enums/request-status";

export type TRequestUpdatePayload = Partial<TRequestCreatePayload> & {
  status?: RequestStatusEnum;
};
