"use client";

import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Editor
        </span>
        {error && (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3" />
            {error}
          </span>
        )}
      </div>
      <ScrollArea className="flex-1 w-full overflow-hidden">
        <textarea
          className="min-h-full w-full resize-none border-0 bg-transparent p-3 font-mono text-sm leading-relaxed outline-none"
          placeholder="Paste or type your JSON here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </ScrollArea>
    </div>
  );
}
