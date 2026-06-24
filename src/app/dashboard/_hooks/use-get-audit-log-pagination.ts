import { useQuery } from "@tanstack/react-query";
import { getAuditLogPagination } from "@/api/requestor/audit-logs";
import CONFIG from "@/common/constants/config";
import type { TAuditLogPaginationPayload } from "@/api/requestor/audit-logs/types/audit-log-pagination-payload";

export function useGetAuditLogPagination(payload: TAuditLogPaginationPayload) {
  return useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.AUDIT_LOG.ALL(), payload],
    queryFn: () => getAuditLogPagination(payload),
  });
}
