import { createContext, useEffect, useState } from "react";

import { Theme } from "@/common/enums/theme";
import type { TThemeProviderState } from "../_types/theme-provider-state";
import type { TThemeProviderProps } from "../_types/theme-provider-props";

const initialState: TThemeProviderState = {
  theme: Theme.System,
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<TThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = Theme.System,
  storageKey = "vite-ui-theme",
  ...props
}: TThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(Theme.Light, Theme.Dark);

    if (theme === Theme.System) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? Theme.Dark
        : Theme.Light;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
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
