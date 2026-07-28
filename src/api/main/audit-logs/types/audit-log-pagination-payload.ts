import type { TMainApiPaginationPayload } from "@/api/main/types/pagination-payload";
import type { TAuditLogSortBy } from "@/api/main/audit-logs/consts/audit-log-sort-by";
import type { AuditLogEntityEnum } from "@/api/main/audit-logs/enums/audit-log-entity";
import type { AuditLogActionEnum } from "@/api/main/audit-logs/enums/audit-log-action";

export type TAuditLogPaginationPayload = TMainApiPaginationPayload & {
  sort_by?: TAuditLogSortBy;
  action?: AuditLogActionEnum;
  target_type?: AuditLogEntityEnum;
};
