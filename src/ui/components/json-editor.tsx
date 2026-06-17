"use client";

import { AlertCircle } from "lucide-react";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function JsonEditor({ value, onChange, error }: JsonEditorProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Editor</span>
        {error && (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3" />
            {error}
          </span>
        )}
      </div>
      <div className="flex min-h-0 flex-1">
        <textarea
          className="size-full resize-none border-0 bg-transparent p-3 font-mono text-sm leading-relaxed outline-none"
          placeholder="Pega o escribe tu JSON aquí..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
