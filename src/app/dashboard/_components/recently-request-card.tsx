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

import type { TRecentlyRequestCardProps } from "@/app/dashboard/_types/dashboard-card-props";

export default function RecentlyRequestCard({
  query,
}: TRecentlyRequestCardProps) {
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
