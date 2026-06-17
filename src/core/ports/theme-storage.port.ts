import type { AccentColor, BaseTheme } from "@/config/theme-config";

export interface ThemeStoragePort {
  getAccent(): AccentColor | null;
  setAccent(color: AccentColor): void;
  getBaseTheme(): BaseTheme | null;
  setBaseTheme(theme: BaseTheme): void;
}
