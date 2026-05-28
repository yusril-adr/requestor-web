import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/app/_components/ui/breadcrumb";

export function meta() {
  return [
    {
      title: "Requestor - Users",
    },
  ];
}

export default function IndexPage() {
  return (
    <div className="w-full h-screen">
      <div className="w-full max-w-7xl flex flex-col px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/users">Users</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mt-4 font-heading text-2xl">Users</h1>
      </div>
    </div>
  );
}
