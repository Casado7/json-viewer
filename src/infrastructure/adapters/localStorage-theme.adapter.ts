import type { ThemeStoragePort } from "@/core/ports/theme-storage.port";
import type { AccentColor, BaseTheme } from "@/config/theme-config";
import { ACCENT_STORAGE_KEY, BASE_THEME_STORAGE_KEY } from "@/config/theme-config";

const ACCENT_VALID: AccentColor[] = [
  "neutral", "gray", "slate", "zinc", "stone",
  "red", "rose", "orange", "green", "blue", "yellow", "violet",
];
const BASE_VALID: BaseTheme[] = [
  "neutral", "stone", "zinc", "gray", "mauve", "olive", "mist", "taupe",
];

export function createLocalStorageThemeAdapter(): ThemeStoragePort {
  return {
    getAccent(): AccentColor | null {
      const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (!stored) return null;
      return ACCENT_VALID.includes(stored as AccentColor) ? (stored as AccentColor) : null;
    },

    setAccent(color: AccentColor): void {
      localStorage.setItem(ACCENT_STORAGE_KEY, color);
    },

    getBaseTheme(): BaseTheme | null {
      const stored = localStorage.getItem(BASE_THEME_STORAGE_KEY);
      if (!stored) return null;
      return BASE_VALID.includes(stored as BaseTheme) ? (stored as BaseTheme) : null;
    },

    setBaseTheme(theme: BaseTheme): void {
      localStorage.setItem(BASE_THEME_STORAGE_KEY, theme);
    },
  };
}
