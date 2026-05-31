import AppBreadcrumb from "@/app/_components/app-breadcrumb";
import AuditLogTable from "@/app/audit-logs/_components/audit-log-table";

export function meta() {
  return [
    {
      title: "Requestor - Audit Logs",
    },
  ];
}

export default function AuditLogPage() {
  const breadcrumbItems = [
    {
      name: "Audit Logs",
    },
  ];

  return (
    <div className="w-full flex justify-center min-w-0">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <div className="flex flex-col">
          <AppBreadcrumb items={breadcrumbItems} />

          <div className="flex justify-between items-center mt-4 mb-6">
            <h1 className="font-heading text-2xl">Audit Logs</h1>
          </div>
        </div>

        <AuditLogTable />
      </div>
    </div>
  );
}
