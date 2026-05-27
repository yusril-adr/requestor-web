import { useContext } from "react";
import { AuthProviderContext } from "../_components/auth-provider";

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useAuth must be used within a AuthProviderContext");

  return context;
};
