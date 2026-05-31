import type { TRequestorApiPaginationPayload } from "@/api/requestor/types/pagination-payload";
import type { TAuditLogSortBy } from "@/api/requestor/audit-logs/consts/audit-log-sort-by";
import type { AuditLogEntityEnum } from "@/api/requestor/audit-logs/enums/audit-log-entity";
import type { AuditLogActionEnum } from "@/api/requestor/audit-logs/enums/audit-log-action";

export type TAuditLogPaginationPayload = TRequestorApiPaginationPayload & {
  sort_by?: TAuditLogSortBy;
  action?: AuditLogActionEnum;
  target_type?: AuditLogEntityEnum;
};
