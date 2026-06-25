import { Card, CardContent, CardTitle } from "@/app/_components/ui/card";
import { Skeleton } from "@/app/_components/ui/skeleton";
import type { TTotalAuditLogCardProps } from "@/app/dashboard/_types/dashboard-card-props";

export default function TotalAuditLogCard({
  query,
}: TTotalAuditLogCardProps) {
  return (
    <Card>
      <CardContent className="h-full">
        {query.isLoading && <Skeleton className="h-full" />}

        {!query.isLoading && (
          <div className="flex flex-col md:flex-row justify-between h-full">
            <CardTitle>Total Audit Logs</CardTitle>

            {!query.isLoading && (
              <p>
                {query.data?.data?.data?.meta?.total_all_data ?? "-"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
