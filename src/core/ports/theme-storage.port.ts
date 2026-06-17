import type { AccentColor } from "@/config/theme-config";

export interface ThemeStoragePort {
  getAccent(): AccentColor | null;
  setAccent(color: AccentColor): void;
}
