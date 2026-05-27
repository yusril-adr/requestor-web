import { Moon, Sun, MonitorSmartphone } from "lucide-react";

import { buttonVariants } from "@/app/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useTheme } from "@/app/_hooks/use-theme";
import { Theme } from "@/common/enums/theme";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const isUsingSystemTheme = theme === Theme.System;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <Sun
            className={`h-[1.2rem] w-[1.2rem] rotate-0 dark:rotate-90 ${!isUsingSystemTheme && "scale-100"} dark:scale-0 transition-all`}
          />
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 dark:rotate-0 scale-0 ${!isUsingSystemTheme && "dark:scale-100"} transition-all`}
          />
          <MonitorSmartphone
            className={`absolute h-[1.2rem] w-[1.2rem] ${!isUsingSystemTheme ? "rotate-90 scale-0" : "rotate-0 scale-100"} transition-all`}
          />
          <span className="sr-only">Toggle theme</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.Light)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.Dark)}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.System)}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
