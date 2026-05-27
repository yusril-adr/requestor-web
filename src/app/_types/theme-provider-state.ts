import { ThemeEnum } from "@/common/enums/theme";

export type TThemeProviderState = {
  theme: ThemeEnum;
  setTheme: (theme: ThemeEnum) => void;
};
