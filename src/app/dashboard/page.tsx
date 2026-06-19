import AppBreadcrumb from "@/app/_components/app-breadcrumb";

import TotalAuditLogCard from "@/app/dashboard/_components/total-audit-log-card";
import TotalRequestCard from "@/app/dashboard/_components/total-request-card";
import TotalUserCard from "@/app/dashboard/_components/total-user-card";
import RecentlyRequestCard from "@/app/dashboard/_components/recently-request-card";
import RecentlyAuditLogCard from "@/app/dashboard/_components/recently-audit-log-card";

export function meta() {
  return [
    {
      title: "Requestor - Dashboard",
    },
  ];
}

export default function DashboardPage() {
  const breadcrumbItems = [
    {
      name: "Dashboard",
    },
  ];

  return (
    <div className="w-full flex justify-center min-w-0">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10 gap-2">
        <div className="mb-2">
          <AppBreadcrumb items={breadcrumbItems} />
        </div>

        <h1 className="font-heading text-2xl">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <TotalUserCard />

          <TotalRequestCard />

          <div className="col-span-2 md:col-span-1">
            <TotalAuditLogCard />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <RecentlyRequestCard />

          <RecentlyAuditLogCard />
        </div>
      </div>
    </div>
  );
}
