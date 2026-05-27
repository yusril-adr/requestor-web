import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../_hooks/use-auth";
import { useEffect } from "react";

export default function NonLoginLayout() {
  const { auth, authQuery } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authQuery?.isLoading && auth) {
      navigate("/", { replace: true });
    }
  }, [authQuery?.isLoading, auth, location.pathname, navigate]);

  // handle SSR
  if (auth) {
    return null;
  }

  return <Outlet />;
}
