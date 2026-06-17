"use client";

import { useAccent } from "@/components/theme-provider";
import { accentColors, accentColorLabels, type AccentColor } from "@/lib/theme-config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

const colorMap: Record<AccentColor, string> = {
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

export function AccentSelector() {
  const { accent, setAccent } = useAccent();

  return (
    <Select value={accent} onValueChange={(v) => setAccent(v as AccentColor)}>
      <SelectTrigger className="w-[130px]">
        <div className="flex items-center gap-2">
          <span className={`block size-3 rounded-full ${colorMap[accent]}`} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {accentColors.map((color) => (
          <SelectItem key={color} value={color}>
            <div className="flex items-center gap-2">
              <span className={`block size-3 rounded-full ${colorMap[color]}`} />
              <span>{accentColorLabels[color]}</span>
              {color === accent && <Check className="ml-auto size-3.5" />}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
