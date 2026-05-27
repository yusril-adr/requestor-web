import { createContext, useEffect, useState } from "react";

import { ThemeEnum } from "@/common/enums/theme";
import type { TThemeProviderState } from "../_types/theme-provider-state";
import type { TThemeProviderProps } from "../_types/theme-provider-props";

const initialState: TThemeProviderState = {
  theme: ThemeEnum.System,
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<TThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = ThemeEnum.System,
  storageKey = "vite-ui-theme",
  ...props
}: TThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeEnum>(
    () => (localStorage.getItem(storageKey) as ThemeEnum) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(ThemeEnum.Light, ThemeEnum.Dark);

    if (theme === ThemeEnum.System) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? ThemeEnum.Dark
        : ThemeEnum.Light;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: ThemeEnum) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
