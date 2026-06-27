import { Link, useNavigate, useParams } from "react-router";
import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import { useEffect, useMemo } from "react";
import { useGetUserById } from "@/app/users/_hooks/use-get-user-by-id";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { ArrowLeft } from "lucide-react";
import dayjs from "@/libs/dayjs";
import { Skeleton } from "@/app/_components/ui/skeleton";
import RequestorAPINotFoundError from "@/api/requestor/errors/not-found-error";

export function meta() {
  return [
    {
      title: "Requestor - User Detail",
    },
  ];
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetUserById(id as string);

  useEffect(() => {
    if (isError && error) {
      if (error instanceof RequestorAPINotFoundError) {
        navigate("/users");
      }
    }
  }, [isError, error, navigate]);

  const breadcrumbItems = useMemo(
    () => [
      {
        name: "Users",
        link: "/users",
      },
      {
        name: data?.data?.data?.name ?? "Detail",
      },
    ],
    [data],
  );

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <AppBreadcrumb items={breadcrumbItems} />

        <div className="flex items-center mt-4 mb-6 gap-x-2">
          <Link to={"/users"}>
            <ArrowLeft />
          </Link>
          <h1 className="font-heading text-2xl">Detail Users</h1>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableHead className="border bg-secondary px-4 py-6">
                    Name
                  </TableHead>
                  <TableCell className="border px-4 py-6" colSpan={3}>
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading && data?.data?.data?.name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableHead className="border bg-secondary px-4 py-6">
                    Email
                  </TableHead>
                  <TableCell className="border px-4 py-6" colSpan={3}>
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading && data?.data?.data?.email}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableHead className="border bg-secondary px-4 py-6">
                    Role
                  </TableHead>
                  <TableCell className="border px-4 py-6">
                    {isLoading && <Skeleton className="h-7" />}
                    {!isLoading && (
                      <Badge variant="outline">{data?.data?.data?.role}</Badge>
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
