"use client";

interface StatusBarProps {
  text: string;
  error: string | null;
  hasJson: boolean;
  isParsing: boolean;
}

export function StatusBar({ text, error, hasJson, isParsing }: StatusBarProps) {
  const lineCount = text ? text.split("\n").length : 0;
  const charCount = text.length;
  const jsonSize = hasJson
    ? `${(new Blob([text]).size / 1024).toFixed(1)} KB`
    : "-";

  return (
    <div className="flex shrink-0 items-center gap-4 border-t px-4 py-1 text-xs text-muted-foreground">
      <span>Líneas: {lineCount}</span>
      <span>Caracteres: {charCount}</span>
      <span>Tamaño: {jsonSize}</span>
      <span className="ml-auto">
        {isParsing ? (
          <span className="text-muted-foreground">Parseando...</span>
        ) : error ? (
          <span className="text-destructive">Error: JSON inválido</span>
        ) : hasJson ? (
          <span className="text-primary">JSON válido</span>
        ) : (
          "Sin datos"
        )}
      </span>
    </div>
  );
}
