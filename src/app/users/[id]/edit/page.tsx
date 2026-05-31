import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import UserEditForm from "@/app/users/[id]/edit/_components/user-edit-form";
import CONFIG from "@/common/constants/config";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/requestor/users/[id]";

export function meta() {
  return [
    {
      title: "Requestor - Update User",
    },
  ];
}

export default function UserEditPage() {
  const params = useParams();
  const getDataQuery = useQuery({
    queryKey: [CONFIG.QUERY_KEY.REQUESTOR_API.USER.ALL(), params.id],
    queryFn: () => getUserById(params.id as string),
    enabled: !!params.id,
  });

  const breadcrumbItems = [
    {
      name: "Users",
      link: "/users",
    },
    ...(!getDataQuery.isLoading
      ? [
          {
            name: getDataQuery.data?.data?.data?.name ?? "Detail",
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
          <Link to={"/users"}>
            <ArrowLeft />
          </Link>
          <h1 className="font-heading text-2xl">Edit User</h1>
        </div>

        <UserEditForm />
      </div>
    </div>
  );
}
