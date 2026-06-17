"use client";

import { ModeToggle } from "@/ui/components/mode-toggle";
import { AccentSelector } from "@/ui/components/accent-selector";
import { BaseThemeSelector } from "@/ui/components/base-theme-selector";
import { FileJson } from "lucide-react";

export function Toolbar() {
  return (
    <div className="flex items-center gap-1.5 border-b px-3 py-2">
      <div className="flex items-center gap-1.5">
        <FileJson className="size-5 text-primary" />
        <span className="text-sm font-semibold">Visor JSON</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <BaseThemeSelector />
        <AccentSelector />
        <ModeToggle />
      </div>
    </div>
  );
}
