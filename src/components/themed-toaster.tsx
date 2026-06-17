"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const theme = !mounted ? "system" : (resolvedTheme === "dark" ? "dark" : "light");

  return <Toaster position="bottom-right" richColors theme={theme} />;
}
