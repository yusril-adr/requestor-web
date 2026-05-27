import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../_hooks/use-auth";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import authMe from "@/api/requestor/auth/me/function";
import CONFIG from "@/common/constants/config";

export default function ProtectedLayout() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = encodeURIComponent(location.pathname);

  const authMutation = useQuery({
    queryKey: CONFIG.QUERY_KEY.REQUESTOR_API.AUTH.ME(),
    queryFn: authMe,
  });

  useEffect(() => {
    if (authMutation.isSuccess && authMutation.data) {
      navigate("/");
    }
  }, [authMutation.isSuccess, authMutation.data]);

  return <Outlet />;
}
