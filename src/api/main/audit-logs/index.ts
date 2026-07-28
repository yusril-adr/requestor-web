import type { AxiosResponse } from "axios";
import { mainAxios } from "@/api/main/_libs/axios";
import MAIN_API_PATH from "@/api/main/_const/path";
import type { TMainApiPaginationResponse } from "@/api/main/types/response";

import type { TAuditLogPaginationPayload } from "@/api/main/audit-logs/types/audit-log-pagination-payload";
import type { TAuditLogResponse } from "@/api/main/audit-logs/types/audit-log-response";

export const getAuditLogPagination = async (
  payload: TAuditLogPaginationPayload,
) => {
  const response: AxiosResponse<
    TMainApiPaginationResponse<TAuditLogResponse>
  > = await mainAxios.get(MAIN_API_PATH.AUDIT_LOG.DEFAULT, {
    params: payload,
  });

  return response;
};
