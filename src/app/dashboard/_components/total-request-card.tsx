import { useQuery } from "@tanstack/react-query";
import { getRequestPagination } from "@/api/requestor/requests";
import { Card, CardContent, CardTitle } from "@/app/_components/ui/card";
import CONFIG from "@/common/constants/config";
import { OrderKeyEnum } from "@/common/enums/order-key";
import { Skeleton } from "@/app/_components/ui/skeleton";
import type { TRequestPaginationPayload } from "@/api/requestor/requests/types/request-pagination-payload";

export default function TotalRequestCard() {
  const getDataPayload: TRequestPaginationPayload = {
    sort_by: "updated_at",
    order: OrderKeyEnum.DESC,
  };
  const getUserDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL(), getDataPayload],
    queryFn: () => getRequestPagination(getDataPayload),
  });

  return (
    <Card>
      <CardContent className="h-full">
        {getUserDataQuery.isLoading && <Skeleton className="h-full" />}

        {!getUserDataQuery.isLoading && (
          <div className="flex flex-col md:flex-row justify-between h-full">
            <CardTitle>Total Requests</CardTitle>

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
