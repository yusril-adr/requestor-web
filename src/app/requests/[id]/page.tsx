import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import { useGetRequestById } from "@/app/requests/_hooks/use-get-request-by-id";
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
import { useIsMobile } from "@/app/_hooks/use-mobile";

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
  const isMobile = useIsMobile();

  const { data, isLoading, isError, error } = useGetRequestById(id as string);

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
    [data],
  );

  const titleCell = (
    <>
      {isLoading && <Skeleton className="h-7" />}
      {!isLoading && data?.data?.data?.title}
    </>
  );
  const requestorNameCell = (
    <>
      {isLoading && <Skeleton className="h-7" />}
      {!isLoading && data?.data?.data?.requestor_name}
    </>
  );
  const assigneeNameCell = (
    <>
      {isLoading && <Skeleton className="h-7" />}
      {(!isLoading && data?.data?.data?.assignee_name) ?? "-"}
    </>
  );
  const priorityCell = (
    <>
      {isLoading && <Skeleton className="h-7" />}
      {!isLoading && (
        <Badge variant="outline">{data?.data?.data?.priority}</Badge>
      )}
    </>
  );
  const statusCell = (
    <>
      {isLoading && <Skeleton className="h-7" />}
      {!isLoading && (
        <Badge variant="outline">{data?.data?.data?.status}</Badge>
      )}
    </>
  );
  const createdAtCell = (
    <>
      {isLoading && <Skeleton className="h-7" />}
      {!isLoading &&
        dayjs(data?.data?.data?.created_at).format("YYYY-MM-DD HH:mm:ss")}
    </>
  );
  const updatedAtCell = (
    <>
      {isLoading && <Skeleton className="h-7" />}
      {!isLoading &&
        dayjs(data?.data?.data?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
    </>
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
            <Table className="table-fixed lg:table-auto">
              <TableBody>
                {isMobile ? (
                  <>
                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Title
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {titleCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Requestor Name
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {requestorNameCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Assignee Name
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {assigneeNameCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Priority
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {priorityCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Status
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {statusCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Created At
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {createdAtCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Updated At
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {updatedAtCell}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <>
                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Title
                      </TableHead>
                      <TableCell
                        className="border px-4 py-6 whitespace-normal break-words"
                        colSpan={3}
                      >
                        {titleCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Requestor Name
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {requestorNameCell}
                      </TableCell>

                      <TableHead className="border bg-secondary px-4 py-6">
                        Assignee Name
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {assigneeNameCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Priority
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {priorityCell}
                      </TableCell>

                      <TableHead className="border bg-secondary px-4 py-6">
                        Status
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {statusCell}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableHead className="border bg-secondary px-4 py-6">
                        Created At
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {createdAtCell}
                      </TableCell>

                      <TableHead className="border bg-secondary px-4 py-6">
                        Updated At
                      </TableHead>
                      <TableCell className="border px-4 py-6 whitespace-normal break-words">
                        {updatedAtCell}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
