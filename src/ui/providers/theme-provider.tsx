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
import type { AccentColor } from "@/config/theme-config";
import { createLocalStorageThemeAdapter } from "@/infrastructure/adapters/localStorage-theme.adapter";

interface ThemeContextValue {
  accent: AccentColor;
  setAccent: (color: AccentColor) => void;
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
}: {
  children: ReactNode;
  defaultAccent?: AccentColor;
}) {
  const [accent, setAccentState] = useState<AccentColor>(defaultAccent);
  const [mounted, setMounted] = useState(false);
  const storage = createLocalStorageThemeAdapter();

  useEffect(() => {
    const stored = storage.getAccent();
    if (stored) setAccentState(stored);
    setMounted(true);
  }, [storage]);

  const setAccent = useCallback(
    (color: AccentColor) => {
      setAccentState(color);
      storage.setAccent(color);
    },
    [storage]
  );

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    const current = html.className
      .split(" ")
      .filter((c) => !c.startsWith("accent-"));
    current.push(`accent-${accent}`);
    html.className = current.join(" ");
  }, [accent, mounted]);

  return (
    <ThemeContext value={{ accent, setAccent }}>
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
