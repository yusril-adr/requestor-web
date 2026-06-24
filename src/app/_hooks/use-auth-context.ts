import { useContext } from "react";
import { AuthProviderContext } from "../_components/auth-provider";

export const useAuthContext = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProviderContext");

  return context;
};
