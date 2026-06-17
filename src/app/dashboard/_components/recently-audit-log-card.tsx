import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Skeleton } from "@/app/_components/ui/skeleton";

import CONFIG from "@/common/constants/config";
import { OrderKeyEnum } from "@/common/enums/order-key";
import { getAuditLogPagination } from "@/api/requestor/audit-logs";
import type { TAuditLogPaginationPayload } from "@/api/requestor/audit-logs/types/audit-log-pagination-payload";

export default function RecentlyAuditLogCard() {
  const getDataPayload: TAuditLogPaginationPayload = {
    page: 1,
    per_page: 3,
    sort_by: "updated_at",
    order: OrderKeyEnum.DESC,
  };
  const getUserDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.AUDIT_LOG.ALL(), getDataPayload],
    queryFn: () => getAuditLogPagination(getDataPayload),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getUserDataQuery.isLoading &&
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-7" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-7" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-7" />
                  </TableCell>
                </TableRow>
              ))}

            {!getUserDataQuery.isLoading &&
              getUserDataQuery.data?.data?.data?.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.actor_name}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.target_type}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
