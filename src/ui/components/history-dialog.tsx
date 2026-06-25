"use client";

import { History, Trash2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUseCase } from "@/ui/providers/use-case-provider";
import { useState } from "react";

interface HistoryDialogProps {
  onLoad: (text: string) => void;
}

function truncate(text: string, max = 80): string {
  const single = text.replace(/\s+/g, " ").trim();
  return single.length > max ? single.slice(0, max) + "..." : single;
}

export function HistoryDialog({ onLoad }: HistoryDialogProps) {
  const useCase = useUseCase();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);

  const handleOpen = () => {
    setItems(useCase.getHistory());
    setOpen(true);
  };

  const handleClear = () => {
    useCase.clearHistory();
    setItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={handleOpen}>
          <History className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Historial</DialogTitle>
        </DialogHeader>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sin historial
          </p>
        ) : (
          <div className="flex flex-col gap-1 overflow-auto">
            {items.map((item, i) => (
              <button
                key={i}
                className="group flex items-start gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                onClick={() => {
                  onLoad(item);
                  setOpen(false);
                }}
              >
                <FileJson className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="font-mono text-xs leading-relaxed text-muted-foreground break-all">
                  {truncate(item)}
                </span>
              </button>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 self-end text-muted-foreground"
            onClick={handleClear}
          >
            <Trash2 data-icon="inline-start" />
            Limpiar historial
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
