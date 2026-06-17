"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { FileJson, Copy, Trash2, Shrink, Download, AlertCircle } from "lucide-react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onExport: () => void;
  onClear: () => void;
  disabled: boolean;
}

export function JsonEditor({
  value,
  onChange,
  error,
  onFormat,
  onMinify,
  onCopy,
  onExport,
  onClear,
  disabled,
}: JsonEditorProps) {
  return (
    <Card className="flex flex-1 flex-col gap-0 rounded-none border-0 border-r">
      <CardHeader className="flex shrink-0 flex-row items-center gap-2 border-b px-3 py-2">
        <CardTitle className="text-xs font-medium text-muted-foreground m-0">
          Editor
        </CardTitle>
        <div data-slot="button-group" className="flex">
          <Button variant="default" size="xs" onClick={onFormat}>
            <FileJson data-icon="inline-start" />
            Formatear
          </Button>
          <Button variant="ghost" size="xs" onClick={onMinify}>
            <Shrink data-icon="inline-start" />
            Minificar
          </Button>
          <Button variant="ghost" size="xs" onClick={onCopy} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
            <Copy data-icon="inline-start" />
            Copiar
          </Button>
          <Button variant="ghost" size="xs" onClick={onExport} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
            <Download data-icon="inline-start" />
            Exportar
          </Button>
          <Button variant="ghost" size="xs" onClick={onClear} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={disabled ? "pointer-events-none opacity-50" : ""}>
            <Trash2 data-icon="inline-start" />
            Limpiar
          </Button>
        </div>
        {error && (
          <span className="ml-auto flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3" />
            {error}
          </span>
        )}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 p-0">
        <ScrollArea className="flex-1 w-full overflow-hidden">
          <textarea
            className="min-h-full w-full resize-none border-0 bg-transparent p-3 font-mono text-sm leading-relaxed outline-none"
            placeholder="Pega o escribe tu JSON aquí..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
