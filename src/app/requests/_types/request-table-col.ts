import type { TRequestResponse } from "@/api/requestor/requests/types/request-response";

export type TRequestTableCol = Omit<
  TRequestResponse,
  "created_at" | "updated_at"
> & {};
