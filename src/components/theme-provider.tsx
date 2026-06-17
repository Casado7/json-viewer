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
import type { AccentColor } from "@/lib/theme-config";
import { ACCENT_STORAGE_KEY } from "@/lib/theme-config";

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

  useEffect(() => {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor | null;
    if (stored && isAccentColor(stored)) {
      setAccentState(stored);
    }
    setMounted(true);
  }, []);

  const setAccent = useCallback((color: AccentColor) => {
    setAccentState(color);
    localStorage.setItem(ACCENT_STORAGE_KEY, color);
  }, []);

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

function isAccentColor(value: string): value is AccentColor {
  return [
    "neutral", "gray", "slate", "zinc", "stone",
    "red", "rose", "orange", "green", "blue", "yellow", "violet",
  ].includes(value);
}
