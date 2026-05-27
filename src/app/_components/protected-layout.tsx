import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../_hooks/use-auth";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const { auth, authQuery } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = encodeURIComponent(location.pathname);

  useEffect(() => {
    if (!authQuery?.isLoading && !auth) {
      navigate(`/login?from=${from}`, { replace: true });
    }
  }, [authQuery?.isLoading, auth, from, navigate]);

  return <Outlet />;
}
