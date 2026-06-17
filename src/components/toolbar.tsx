"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { AccentSelector } from "@/components/accent-selector";
import {
  FileJson,
  Copy,
  Trash2,
  Shrink,
  Maximize2,
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
}: ToolbarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const disabled = mounted ? !hasJson : true;
  return (
    <div className="flex items-center gap-1.5 border-b px-3 py-2">
      <div className="flex items-center gap-1.5">
        <FileJson className="size-5 text-primary" />
        <span className="text-sm font-semibold">JSON Viewer</span>
      </div>

      <Separator orientation="vertical" className="mx-2 h-5" />

      <Button variant="ghost" size="sm" onClick={onFormat}>
        Format
      </Button>
      <Button variant="ghost" size="sm" onClick={onMinify}>
        <Shrink data-icon="inline-start" />
        Minify
      </Button>

      <Separator orientation="vertical" className="mx-2 h-5" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onCopy}
        disabled={disabled}
      >
        <Copy data-icon="inline-start" />
        Copy
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onExport}
        disabled={disabled}
      >
        <Download data-icon="inline-start" />
        Export
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        disabled={disabled}
      >
        <Trash2 data-icon="inline-start" />
        Clear
      </Button>

      <Separator orientation="vertical" className="mx-2 h-5" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onCollapseAll}
        disabled={disabled}
      >
        <Maximize2 data-icon="inline-start" />
        Collapse
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onExpandAll}
        disabled={disabled}
      >
        Expand
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <AccentSelector />
        <ModeToggle />
      </div>
    </div>
  );
}
