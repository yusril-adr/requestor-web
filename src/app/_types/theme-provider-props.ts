import type { Theme } from "@/common/enums/theme";

export type TThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
