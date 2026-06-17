"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AccentColor, BaseTheme } from "@/config/theme-config";
import { createLocalStorageThemeAdapter } from "@/infrastructure/adapters/localStorage-theme.adapter";

interface ThemeContextValue {
  accent: AccentColor;
  setAccent: (color: AccentColor) => void;
  baseTheme: BaseTheme;
  setBaseTheme: (theme: BaseTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useAccent() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAccent must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({
  children,
  defaultAccent = "blue",
  defaultBaseTheme = "neutral",
}: {
  children: ReactNode;
  defaultAccent?: AccentColor;
  defaultBaseTheme?: BaseTheme;
}) {
  const [accent, setAccentState] = useState<AccentColor>(defaultAccent);
  const [baseTheme, setBaseThemeState] = useState<BaseTheme>(defaultBaseTheme);
  const [mounted, setMounted] = useState(false);
  const storage = createLocalStorageThemeAdapter();

  useEffect(() => {
    const storedAccent = storage.getAccent();
    if (storedAccent) setAccentState(storedAccent);
    const storedTheme = storage.getBaseTheme();
    if (storedTheme) setBaseThemeState(storedTheme);
    setMounted(true);
  }, [storage]);

  const setAccent = useCallback(
    (color: AccentColor) => {
      setAccentState(color);
      storage.setAccent(color);
    },
    [storage]
  );

  const setBaseTheme = useCallback(
    (theme: BaseTheme) => {
      setBaseThemeState(theme);
      storage.setBaseTheme(theme);
    },
    [storage]
  );

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const classes = html.className
      .split(" ")
      .filter((c) => !c.startsWith("accent-") && !c.startsWith("theme-"));
    classes.push(`accent-${accent}`, `theme-${baseTheme}`);
    html.className = classes.join(" ");
  }, [accent, baseTheme, mounted]);

  return (
    <ThemeContext value={{ accent, setAccent, baseTheme, setBaseTheme }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </ThemeContext>
  );
}
