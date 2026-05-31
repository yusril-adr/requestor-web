import { Plus } from "lucide-react";
import { Link } from "react-router";
import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import { Button } from "@/app/_components/ui/button";
import RequestTable from "@/app/requests/_components/request-table";

export function meta() {
  return [
    {
      title: "Requestor - Requests",
    },
  ];
}

export default function RequstPage() {
  const breadcrumbItems = [
    {
      name: "Requests",
    },
  ];

  return (
    <div className="w-full flex justify-center min-w-0">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <div className="flex flex-col">
          <AppBreadcrumb items={breadcrumbItems} />

          <div className="flex justify-between items-center mt-4 mb-6">
            <h1 className="font-heading text-2xl">Requests</h1>

            <Button
              render={<Link to="/requests/create" />}
              nativeButton={false}
            >
              <Plus /> Add Request
            </Button>
          </div>
        </div>
        <RequestTable />
      </div>
    </div>
  );
}
