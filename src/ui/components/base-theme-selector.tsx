"use client";

import { useAccent } from "@/ui/providers/theme-provider";
import { baseThemes, baseThemeLabels, type BaseTheme } from "@/config/theme-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { toast } from "sonner";

const themeColorMap: Record<BaseTheme, string> = {
  neutral: "bg-neutral-500",
  stone: "bg-stone-500",
  zinc: "bg-zinc-500",
  gray: "bg-gray-500",
  mauve: "bg-purple-400",
  olive: "bg-green-600",
  mist: "bg-sky-400",
  taupe: "bg-amber-700",
};

export function BaseThemeSelector() {
  const { baseTheme, setBaseTheme } = useAccent();

  return (
    <Select
      value={baseTheme}
      onValueChange={(v) => {
        setBaseTheme(v as BaseTheme);
        toast.success(`Tema: ${baseThemeLabels[v as BaseTheme]}`);
      }}
    >
      <SelectTrigger className="w-[130px]">
        <div className="flex items-center gap-2">
          <span className={`block size-3 rounded-full ${themeColorMap[baseTheme]}`} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {baseThemes.map((theme) => (
          <SelectItem key={theme} value={theme}>
            <div className="flex items-center gap-2">
              <span className={`block size-3 rounded-full ${themeColorMap[theme]}`} />
              <span>{baseThemeLabels[theme]}</span>
              {theme === baseTheme && <Check className="ml-auto size-3.5" />}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
