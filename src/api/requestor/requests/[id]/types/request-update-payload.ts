import type { TRequestCreatePayload } from "@/api/requestor/requests/types/request-create-payload";
import { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";

export type TRequestUpdatePayload = Partial<TRequestCreatePayload> & {
  status?: RequestStatusEnum;
};
