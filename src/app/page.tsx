import { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    {
      title: "Requestor",
    },
  ];
}

export default function IndexPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full max-w-7xl flex flex-col px-10 pb-10">
        <span>Index Page</span>
      </div>
    </div>
  );
}
