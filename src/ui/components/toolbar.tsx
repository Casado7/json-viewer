"use client";

import { FileJson } from "lucide-react";
import { ThemeMenu } from "@/ui/components/theme-menu";

export function Toolbar() {
  return (
    <div className="flex items-center gap-1.5 border-b px-3 py-2">
      <div className="flex items-center gap-1.5">
        <FileJson className="size-5 text-primary" />
        <span className="text-sm font-semibold">Visor JSON</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeMenu />
      </div>
    </div>
  );
}
