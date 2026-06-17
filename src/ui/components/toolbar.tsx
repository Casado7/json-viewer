"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/ui/components/mode-toggle";
import { AccentSelector } from "@/ui/components/accent-selector";
import { BaseThemeSelector } from "@/ui/components/base-theme-selector";
import {
  FileJson,
  Copy,
  Trash2,
  Shrink,
  Maximize2,
  Minimize2,
  Download,
} from "lucide-react";

interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onClear: () => void;
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onExport: () => void;
  hasJson: boolean;
  isParsing: boolean;
}

export function Toolbar({
  onFormat,
  onMinify,
  onCopy,
  onClear,
  onCollapseAll,
  onExpandAll,
  onExport,
  hasJson,
  isParsing,
}: ToolbarProps) {
  const disabled = !hasJson || isParsing;
  return (
    <div className="flex items-center gap-1.5 border-b px-3 py-2">
      <div className="flex items-center gap-1.5">
        <FileJson className="size-5 text-primary" />
        <span className="text-sm font-semibold">Visor JSON</span>
      </div>

      <Separator orientation="vertical" className="mx-2 h-5" />

      <div data-slot="button-group" className="flex">
        <Button variant="ghost" size="sm" onClick={onFormat}>
          <FileJson data-icon="inline-start" />
          Formatear
        </Button>
        <Button variant="ghost" size="sm" onClick={onMinify}>
          <Shrink data-icon="inline-start" />
          Minificar
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-2 h-5" />

      <div data-slot="button-group" className="flex">
        <Button variant="ghost" size="sm" onClick={onCopy} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
          <Copy data-icon="inline-start" />
          Copiar
        </Button>
        <Button variant="ghost" size="sm" onClick={onExport} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
          <Download data-icon="inline-start" />
          Exportar
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
          <Trash2 data-icon="inline-start" />
          Limpiar
        </Button>
      </div>

      <Separator orientation="vertical" className="mx-2 h-5" />

      <div data-slot="button-group" className="flex">
        <Button variant="ghost" size="sm" onClick={onCollapseAll} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
          <Minimize2 data-icon="inline-start" />
          Colapsar
        </Button>
        <Button variant="ghost" size="sm" onClick={onExpandAll} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
          <Maximize2 data-icon="inline-start" />
          Expandir
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <BaseThemeSelector />
        <AccentSelector />
        <ModeToggle />
      </div>
    </div>
  );
}
