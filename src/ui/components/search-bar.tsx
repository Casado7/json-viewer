"use client";

import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  resultCount: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export function SearchBar({
  onSearch,
  resultCount,
  currentIndex,
  onNext,
  onPrev,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        setValue("");
        onSearch("");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onSearch]);

  const handleChange = useCallback(
    (val: string) => {
      setValue(val);
      onSearch(val);
    },
    [onSearch]
  );

  if (!open) return null;

  return (
    <div className="flex items-center gap-1 border-b px-3 py-1.5">
      <Search className="size-3.5 text-muted-foreground shrink-0" />
      <Input
        className="h-7 text-xs flex-1 min-w-0"
        placeholder="Buscar (Ctrl+F)"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        autoFocus
      />
      {resultCount > 0 && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {currentIndex + 1}/{resultCount}
        </span>
      )}
      {resultCount > 1 && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6" onClick={onPrev}>
                <ChevronUp className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Anterior</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6" onClick={onNext}>
                <ChevronDown className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Siguiente</TooltipContent>
          </Tooltip>
        </>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => {
              setOpen(false);
              setValue("");
              onSearch("");
            }}
          >
            <X className="size-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Cerrar búsqueda</TooltipContent>
      </Tooltip>
    </div>
  );
}
