import { useNavigate } from "react-router";

import { ThemeToggler } from "@/app/_components/theme-toggler";
import { LoginForm } from "@/app/login/form";
import { useLogin } from "@/app/login/_hooks/use-login";

export function meta() {
  return [
    {
      title: "Requestor - Login",
    },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const {
    mutate: loginMutate,
    error: loginError,
    isPending: loginIsPending,
    isPaused: loginIsPaused,
  } = useLogin({
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  return (
    <div className="w-full flex justify-center items-center">
      <main className="flex w-full h-[calc(100vh-32px)] max-w-7xl px-10 relative">
        <div className="absolute right-0 top-0 pt-4">
          <ThemeToggler />
        </div>

        <div className="hidden lg:flex lg:w-1/2 h-screen justify-center items-center">
          <img
            src="https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/main/React/png/React.png"
            alt="react logo"
          />
        </div>

        <LoginForm
          onSubmitPayload={loginMutate}
          mutationError={loginError}
          isPending={loginIsPending}
          isPaused={loginIsPaused}
        />
      </main>
    </div>
  );
}
