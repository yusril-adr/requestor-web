import { Button } from "@/app/_components/ui/button";
import { Link } from "react-router";

export function meta() {
  return [
    {
      title: "Requestor",
    },
  ];
}

export default function IndexPage() {
  return (
    <div className="flex">
      <span>Index Page</span>

      <Button>
        <Link to="/login">Login</Link>
      </Button>
    </div>
  );
}
