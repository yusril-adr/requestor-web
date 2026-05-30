import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import UserTable from "@/app/users/_components/user-table";
import { Button } from "../_components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export function meta() {
  return [
    {
      title: "Requestor - Users",
    },
  ];
}

export default function UserPage() {
  const breadcrumbItems = [
    {
      name: "Users",
    },
  ];

  return (
    <div className="w-full flex justify-center min-w-0">
      <div className="w-full max-w-7xl flex flex-col px-10">
        <div className="flex flex-col">
          <AppBreadcrumb items={breadcrumbItems} />

          <div className="flex justify-between items-center mt-4 mb-6">
            <h1 className="font-heading text-2xl">Users</h1>

            <Button render={<Link to="/users/create" />} nativeButton={false}>
              <Plus /> Add User
            </Button>
          </div>
        </div>
        <UserTable />
      </div>
    </div>
  );
}
