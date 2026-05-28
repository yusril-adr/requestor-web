import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "./ui/breadcrumb";

type BreadcrumbPageProps = {
  items: {
    name: string;
    link?: string;
  }[];
};

export default function AppBreadcrumb({ items }: BreadcrumbPageProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.link ? (
              <BreadcrumbLink
                render={<Link to={item.link}>{item.name}</Link>}
              />
            ) : (
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
