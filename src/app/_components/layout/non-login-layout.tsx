import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../../_hooks/use-auth-context";
import { useEffect } from "react";
import GlobalLoader from "../global-loader";

export default function NonLoginLayout() {
  const { auth, authQuery } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authQuery?.isLoading && auth) {
      navigate("/dashboard", { replace: true });
    }
  }, [authQuery?.isLoading, auth, location.pathname, navigate]);

  return (
    <>
      {authQuery?.isLoading && <GlobalLoader />}
      <Outlet />
    </>
  );
}
