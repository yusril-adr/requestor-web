import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../../_hooks/use-auth-context";
import { useEffect } from "react";
import GlobalLoader from "../global-loader";

export default function ProtectedLayout() {
  const { auth, authQuery } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = encodeURIComponent(location.pathname + location.search);

  useEffect(() => {
    if (!authQuery?.isLoading && !auth) {
      navigate(`/login?from=${from}`, { replace: true });
    }
  }, [authQuery?.isLoading, auth, from, navigate]);

  return (
    <>
      {authQuery?.isLoading && <GlobalLoader />}
      <Outlet />
    </>
  );
}
