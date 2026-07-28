import type { TAuditLogResponse } from "@/api/main/audit-logs/types/audit-log-response";

export type TAuditLogTableCol = Omit<TAuditLogResponse, "updated_at"> & {};
