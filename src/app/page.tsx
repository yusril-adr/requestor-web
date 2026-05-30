import UserTable from "./users/_components/user-table";

export function meta() {
  return [
    {
      title: "Requestor",
    },
  ];
}

export default function IndexPage() {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-7xl flex flex-col px-10">
        <span>Index Page</span>
      </div>

      <UserTable />
    </div>
  );
}
