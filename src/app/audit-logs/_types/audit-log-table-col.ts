import type { TAuditLogResponse } from "@/api/requestor/audit-logs/types/audit-log-response";

export type TAuditLogTableCol = Omit<
  TAuditLogResponse,
  "created_at" | "updated_at"
> & {};
