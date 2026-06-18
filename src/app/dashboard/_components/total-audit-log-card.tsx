import { useQuery } from "@tanstack/react-query";
import { getAuditLogPagination } from "@/api/requestor/audit-logs";
import { Card, CardContent, CardTitle } from "@/app/_components/ui/card";
import CONFIG from "@/common/constants/config";
import { OrderKeyEnum } from "@/common/enums/order-key";
import { Skeleton } from "@/app/_components/ui/skeleton";
import type { TAuditLogPaginationPayload } from "@/api/requestor/audit-logs/types/audit-log-pagination-payload";

export default function TotalAuditLogCard() {
  const getDataPayload: TAuditLogPaginationPayload = {
    sort_by: "updated_at",
    order: OrderKeyEnum.DESC,
  };
  const getUserDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.AUDIT_LOG.ALL()],
    queryFn: () => getAuditLogPagination(getDataPayload),
  });

  return (
    <Card>
      <CardContent className="h-full">
        {getUserDataQuery.isLoading && <Skeleton className="h-full" />}

        {!getUserDataQuery.isLoading && (
          <div className="flex flex-col md:flex-row justify-between h-full">
            <CardTitle>Total Audit Logs</CardTitle>

            {!getUserDataQuery.isLoading && (
              <p>
                {getUserDataQuery.data?.data?.data?.meta?.total_all_data ?? "-"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
