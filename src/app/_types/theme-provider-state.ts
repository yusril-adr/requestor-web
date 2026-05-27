import { Theme } from "@/common/enums/theme";

export type TThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};
