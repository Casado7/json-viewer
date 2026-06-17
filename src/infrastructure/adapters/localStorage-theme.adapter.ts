import type { ThemeStoragePort } from "@/core/ports/theme-storage.port";
import type { AccentColor } from "@/config/theme-config";
import { ACCENT_STORAGE_KEY } from "@/config/theme-config";

export function createLocalStorageThemeAdapter(): ThemeStoragePort {
  return {
    getAccent(): AccentColor | null {
      const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (!stored) return null;
      const valid: AccentColor[] = [
        "neutral", "gray", "slate", "zinc", "stone",
        "red", "rose", "orange", "green", "blue", "yellow", "violet",
      ];
      return valid.includes(stored as AccentColor) ? (stored as AccentColor) : null;
    },

    setAccent(color: AccentColor): void {
      localStorage.setItem(ACCENT_STORAGE_KEY, color);
    },
  };
}
