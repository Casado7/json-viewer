"use client";

import { Palette, Check, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useAccent } from "@/ui/providers/theme-provider";
import {
  baseThemes,
  baseThemeLabels,
  accentColors,
  accentColorLabels,
  type BaseTheme,
  type AccentColor,
} from "@/config/theme-config";
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

const accentColorMap: Record<AccentColor, string> = {
  neutral: "bg-neutral-500",
  gray: "bg-gray-500",
  slate: "bg-slate-500",
  zinc: "bg-zinc-500",
  stone: "bg-stone-500",
  red: "bg-red-500",
  rose: "bg-rose-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
  violet: "bg-violet-500",
};

const modeIcon = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const modeLabel = {
  light: "Claro",
  dark: "Oscuro",
  system: "Sistema",
};

export function ThemeMenu() {
  const { setTheme, theme } = useTheme();
  const { accent, setAccent, baseTheme, setBaseTheme } = useAccent();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Tema base
        </DropdownMenuLabel>
        {baseThemes.map((t) => (
          <DropdownMenuItem
            key={t}
            onSelect={(e) => e.preventDefault()}
            onClick={() => {
              setBaseTheme(t);
              toast.success(`Tema: ${baseThemeLabels[t]}`);
            }}
          >
            <span className={`block size-3 rounded-full ${themeColorMap[t]}`} />
            <span className="ml-2 flex-1">{baseThemeLabels[t]}</span>
            {t === baseTheme && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Color acento
        </DropdownMenuLabel>
        {accentColors.map((c) => (
          <DropdownMenuItem
            key={c}
            onSelect={(e) => e.preventDefault()}
            onClick={() => {
              setAccent(c);
              toast.success(`Acento: ${accentColorLabels[c]}`);
            }}
          >
            <span className={`block size-3 rounded-full ${accentColorMap[c]}`} />
            <span className="ml-2 flex-1">{accentColorLabels[c]}</span>
            {c === accent && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Modo
        </DropdownMenuLabel>
        {(["light", "dark", "system"] as const).map((m) => {
          const Icon = modeIcon[m];
          return (
            <DropdownMenuItem
              key={m}
              onSelect={(e) => e.preventDefault()}
              onClick={() => {
                setTheme(m);
                toast.success(`Modo ${modeLabel[m].toLowerCase()}`);
              }}
            >
              <Icon className="size-4" />
              <span className="ml-2 flex-1">{modeLabel[m]}</span>
              {theme === m && <Check className="size-3.5" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
