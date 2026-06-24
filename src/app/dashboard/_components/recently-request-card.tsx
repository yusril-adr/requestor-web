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

import { OrderKeyEnum } from "@/common/enums/order-key";
import type { TRequestPaginationPayload } from "@/api/requestor/requests/types/request-pagination-payload";
import { useGetRequestPagination } from "@/app/dashboard/_hooks/use-get-request-pagination";

export default function RecentlyRequestCard() {
  const getDataPayload: TRequestPaginationPayload = {
    page: 1,
    per_page: 3,
    sort_by: "updated_at",
    order: OrderKeyEnum.DESC,
  };
  const getUserDataQuery = useGetRequestPagination(getDataPayload);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
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
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.priority}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
