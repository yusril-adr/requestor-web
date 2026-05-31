import { useQuery } from "@tanstack/react-query";
import { getUserPagination } from "@/api/requestor/users";
import { Card, CardContent, CardTitle } from "@/app/_components/ui/card";
import CONFIG from "@/common/constants/config";
import { OrderKeyEnum } from "@/common/enums/order-key";
import { Skeleton } from "@/app/_components/ui/skeleton";
import type { TUserPaginationPayload } from "@/api/requestor/users/types/user-pagination-payload";

export default function TotalUserCard() {
  const getDataPayload: TUserPaginationPayload = {
    sort_by: "updated_at",
    order: OrderKeyEnum.DESC,
  };
  const getUserDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL(), getDataPayload],
    queryFn: () => getUserPagination(getDataPayload),
  });

  return (
    <Card>
      <CardContent className="h-full">
        {getUserDataQuery.isLoading && <Skeleton className="h-full" />}

        {!getUserDataQuery.isLoading && (
          <div className="flex flex-col md:flex-row justify-between h-full">
            <CardTitle>Total Users</CardTitle>

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
