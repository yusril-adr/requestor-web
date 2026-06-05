import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import CONFIG from "@/common/constants/config";
import { getRequestById } from "@/api/requestor/requests/[id]";
import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import dayjs from "@/libs/dayjs";
import { Skeleton } from "@/app/_components/ui/skeleton";

import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";

export function meta() {
  return [
    {
      title: "Requestor - Request Detail",
    },
  ];
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL(), id],
    queryFn: () => getRequestById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (isError && error && error instanceof RequestorAPINotFoundError) {
      navigate("/requests");
    }
  }, [isError, error, navigate]);

  const breadcrumbItems = useMemo(
    () => [
      {
        name: "Requests",
        link: "/requests",
      },
      {
        name: data?.data?.data?.title ?? "Detail",
      },
    ],
    [data, isLoading],
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <AppBreadcrumb items={breadcrumbItems} />

        <div className="flex items-center mt-4 mb-6 gap-x-2">
          <Link to={"/requests"}>
            <ArrowLeft />
          </Link>
          <h1 className="font-heading text-2xl">Detail Requests</h1>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="border bg-secondary px-4 py-6">
                    Title
                  </TableHead>
                  <TableCell className="border px-4 py-6" colSpan={3}>
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading && data?.data?.data?.title}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableHead className="border bg-secondary px-4 py-6">
                    Requestor Name
                  </TableHead>
                  <TableCell className="border px-4 py-6">
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading && data?.data?.data?.requestor_name}
                  </TableCell>

                  <TableHead className="border bg-secondary px-4 py-6">
                    Assignee Name
                  </TableHead>
                  <TableCell className="border px-4 py-6">
                    {isLoading && <Skeleton className="h-7" />}
                    {(!isLoading && data?.data?.data?.assignee_name) ?? "-"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableHead className="border bg-secondary px-4 py-6">
                    Priority
                  </TableHead>
                  <TableCell className="border px-4 py-6">
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading && (
                      <Badge variant="outline">
                        {data?.data?.data?.priority}
                      </Badge>
                    )}
                  </TableCell>

                  <TableHead className="border bg-secondary px-4 py-6">
                    Status
                  </TableHead>
                  <TableCell className="border px-4 py-6">
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading && (
                      <Badge variant="outline">
                        {data?.data?.data?.status}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableHead className="border bg-secondary px-4 py-6">
                    Created At
                  </TableHead>
                  <TableCell className="border px-4 py-6">
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading &&
                      dayjs(data?.data?.data?.created_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                  </TableCell>

                  <TableHead className="border bg-secondary px-4 py-6">
                    Updated At
                  </TableHead>
                  <TableCell className="border px-4 py-6">
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading &&
                      dayjs(data?.data?.data?.updated_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
