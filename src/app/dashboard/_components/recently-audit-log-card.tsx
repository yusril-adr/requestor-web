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

import type { TRecentlyAuditLogCardProps } from "@/app/dashboard/_types/dashboard-card-props";

export default function RecentlyAuditLogCard({
  query,
}: TRecentlyAuditLogCardProps) {
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
            {query.isLoading &&
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

            {!query.isLoading &&
              query.data?.data?.data?.items.map((item) => (
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
