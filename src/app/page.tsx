import { Button } from "@/app/_components/ui/button";
import { Link } from "react-router";
import { useAuth } from "./_hooks/use-auth";

export function meta() {
  return [
    {
      title: "Requestor",
    },
  ];
}

export default function IndexPage() {
  const { logout } = useAuth();

  return (
    <div className="flex">
      <span>Index Page</span>

      <Button>
        <Link to="/login">Login</Link>
      </Button>

      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
