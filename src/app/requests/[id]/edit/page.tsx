import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import RequestEditForm from "@/app/requests/[id]/edit/_components/request-edit-form";
import CONFIG from "@/common/constants/config";
import { useQuery } from "@tanstack/react-query";
import { getRequestById } from "@/api/requestor/requests/[id]";

export function meta() {
  return [
    {
      title: "Requestor - Update request",
    },
  ];
}

export default function RequestEditPage() {
  const params = useParams();
  const getDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.REQUEST.ALL(), params.id],
    queryFn: () => getRequestById(params.id as string),
    enabled: !!params.id,
  });

  const breadcrumbItems = [
    {
      name: "Requests",
      link: "/requests",
    },
    ...(!getDataQuery.isLoading
      ? [
          {
            name: getDataQuery.data?.data?.data?.title ?? "Detail",
            link: `/requests/${params.id}`,
          },
        ]
      : []),
    {
      name: "Edit",
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <AppBreadcrumb items={breadcrumbItems} />

        <div className="flex items-center mt-4 mb-6 gap-x-2">
          <Link to={"/requests"}>
            <ArrowLeft />
          </Link>
          <h1 className="font-heading text-2xl">Edit Request</h1>
        </div>

        <RequestEditForm />
      </div>
    </div>
  );
}
