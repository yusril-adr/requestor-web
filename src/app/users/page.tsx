import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import UserTable from "@/app/users/_components/user-table";

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
    <div className="w-full h-[calc(100vh - 32px)] flex justify-center">
      <div className="w-full max-w-7xl flex flex-col px-10">
        <AppBreadcrumb items={breadcrumbItems} />

        <h1 className="mt-4 mb-6 font-heading text-2xl">Users</h1>

        <UserTable />
      </div>
    </div>
  );
}
