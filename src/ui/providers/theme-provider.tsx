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

  useEffect(() => {
    if (!mounted) return;
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim() || "#2dd4bf";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>`;
    const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    const link = document.querySelector("link[rel='icon']");
    if (link) link.setAttribute("href", dataUri);
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
