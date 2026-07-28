import type { TRequestResponse } from "@/api/main/requests/types/request-response";

export type TRequestTableCol = Omit<
  TRequestResponse,
  "created_at" | "updated_at"
> & {};
