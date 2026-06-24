import { Card, CardContent, CardTitle } from "@/app/_components/ui/card";
import { OrderKeyEnum } from "@/common/enums/order-key";
import { Skeleton } from "@/app/_components/ui/skeleton";
import type { TRequestPaginationPayload } from "@/api/requestor/requests/types/request-pagination-payload";
import { useGetRequestPagination } from "@/app/dashboard/_hooks/use-get-request-pagination";

export default function TotalRequestCard() {
  const getDataPayload: TRequestPaginationPayload = {
    sort_by: "updated_at",
    order: OrderKeyEnum.DESC,
  };
  const getUserDataQuery = useGetRequestPagination(getDataPayload);

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
