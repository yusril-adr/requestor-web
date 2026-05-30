import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type BreadcrumbPageItemProp = {
  name: string;
  link?: string;
};

type BreadcrumbPageProps = {
  items: BreadcrumbPageItemProp[];
};

const BreadCrumbItemWithSeperator = ({
  item,
  index,
  items,
}: {
  item: BreadcrumbPageItemProp;
  index: number;
  items: BreadcrumbPageItemProp[];
}) => {
  return (
    <>
      <BreadcrumbItem>
        {item.link ? (
          <BreadcrumbLink render={<Link to={item.link}>{item.name}</Link>} />
        ) : (
          <BreadcrumbPage>{item.name}</BreadcrumbPage>
        )}
      </BreadcrumbItem>

      {index !== items.length - 1 && <BreadcrumbSeparator />}
    </>
  );
};

export default function AppBreadcrumb({ items }: BreadcrumbPageProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadCrumbItemWithSeperator
            key={index}
            item={item}
            index={index}
            items={items}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
