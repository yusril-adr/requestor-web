import type { ThemeEnum } from "@/common/enums/theme";

export type TThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeEnum;
  storageKey?: string;
};
