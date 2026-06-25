import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import RequestCreateForm from "@/app/requests/create/form";

export function meta() {
  return [
    {
      title: "Requestor - Create Request",
    },
  ];
}

export default function RequestCreatePage() {
  const breadcrumbItems = [
    {
      name: "Requests",
      link: "/requests",
    },
    {
      name: "Create",
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
          <h1 className="font-heading text-2xl">Create Request</h1>
        </div>

        <RequestCreateForm />
      </div>
    </div>
  );
}
