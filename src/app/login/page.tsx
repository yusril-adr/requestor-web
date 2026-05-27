import { ThemeToggler } from "@/app/_components/theme-toggler";
import { LoginForm } from "./_components/login-form";

export function meta() {
  return [
    {
      title: "Requestor - Login",
    },
  ];
}

export default function Login() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <main className="flex w-full max-w-7xl px-8 relative">
        <div className="absolute right-0 top-0 pt-4">
          <ThemeToggler />
        </div>

        <div className="hidden lg:flex lg:w-1/2 h-screen justify-center items-center">
          <img
            src="https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/main/React/png/React.png"
            alt="react logo"
          />
        </div>

        <LoginForm />
      </main>
    </div>
  );
}
