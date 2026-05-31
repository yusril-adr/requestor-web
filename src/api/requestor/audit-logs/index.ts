import type { AxiosResponse } from "axios";
import { requestorAxios } from "@/api/requestor/_libs/axios";
import REQUESTOR_API_PATH from "@/api/requestor/_const/path";
import type { TRequestorApiPaginationResponse } from "@/api/requestor/types/response";

import type { TAuditLogPaginationPayload } from "@/api/requestor/audit-logs/types/audit-log-pagination-payload";
import type { TAuditLogResponse } from "@/api/requestor/audit-logs/types/audit-log-response";

export const getAuditLogPagination = async (
  payload: TAuditLogPaginationPayload,
) => {
  const response: AxiosResponse<
    TRequestorApiPaginationResponse<TAuditLogResponse>
  > = await requestorAxios.get(REQUESTOR_API_PATH.AUDIT_LOG.DEFAULT, {
    params: payload,
  });

  return response;
};
