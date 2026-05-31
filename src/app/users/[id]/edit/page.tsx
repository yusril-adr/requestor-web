import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import UserEditForm from "@/app/users/[id]/edit/_components/user-edit-form";

export function meta() {
  return [
    {
      title: "Requestor - Update User",
    },
  ];
}

export default function UserEditPage() {
  const breadcrumbItems = [
    {
      name: "Users",
      link: "/users",
    },
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
