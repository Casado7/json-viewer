"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JsonNode } from "@/core/domain/entities/json-node";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Toolbar } from "@/ui/components/toolbar";
import { JsonEditor } from "@/ui/components/json-editor";
import { JsonTreeView } from "@/ui/components/json-tree-view";
import { StatusBar } from "@/ui/components/status-bar";
import { useUseCase } from "@/ui/providers/use-case-provider";
import { Undo2, Redo2 } from "lucide-react";

export default function Home() {
  const useCase = useUseCase();
  const textRef = useRef("");
  const treeRef = useRef(null);
  const [state, setState] = useState({
    text: "",
    tree: null as JsonNode | null,
    error: null as string | null,
    searchTerm: "",
  });
  const [isParsing, setIsParsing] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useEffect(() => {
    const initial = useCase.loadInitialState();
    if (initial.text !== undefined) {
      textRef.current = initial.text;
      setState((prev) => ({ ...prev, ...initial }));
    }
  }, [useCase]);

  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined as any);

  const pushUndo = useCallback(() => {
    setUndoStack((prev) => [textRef.current, ...prev].slice(0, 50));
    setRedoStack([]);
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      if (!typingTimerRef.current) pushUndo();
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        typingTimerRef.current = undefined as any;
      }, 2000);

      textRef.current = value;
      setState((prev) => ({ ...prev, text: value }));
      setIsParsing(true);
      useCase.processInput(value, (partial) => {
        setState((prev) => ({ ...prev, ...partial }));
        setIsParsing(false);
      });
    },
    [useCase, pushUndo]
  );

  const handleFormat = useCallback(() => {
    pushUndo();
    const formatted = useCase.format(textRef.current);
    if (formatted !== null) {
      textRef.current = formatted;
      setState((prev) => ({ ...prev, text: formatted }));
      useCase.processInput(formatted, (partial) => {
        setState((prev) => ({ ...prev, ...partial }));
      });
    }
  }, [useCase, pushUndo]);

  const handleMinify = useCallback(() => {
    pushUndo();
    const minified = useCase.minify(textRef.current);
    if (minified !== null) {
      textRef.current = minified;
      setState((prev) => ({ ...prev, text: minified }));
      useCase.processInput(minified, (partial) => {
        setState((prev) => ({ ...prev, ...partial }));
      });
    }
  }, [useCase]);

  const handleCopy = useCallback(() => {
    useCase.copy(textRef.current);
  }, [useCase]);

  const handleExport = useCallback(() => {
    useCase.export(textRef.current);
  }, [useCase]);

  const handleClear = useCallback(() => {
    pushUndo();
    textRef.current = "";
    setState({ text: "", tree: null, error: null, searchTerm: "" });
    useCase.notifyClear();
  }, [useCase]);

  const hasJson = !!state.tree;
  const disabled = !hasJson || isParsing;

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    setRedoStack((prev) => [textRef.current, ...prev]);
    const prevText = undoStack[0];
    setUndoStack((prevStack) => prevStack.slice(1));
    textRef.current = prevText;
    setState((s) => ({ ...s, text: prevText }));
    useCase.processInput(prevText, (partial) => {
      setState((s) => ({ ...s, ...partial }));
    });
  }, [undoStack, useCase]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    setUndoStack((prev) => [textRef.current, ...prev]);
    const nextText = redoStack[0];
    setRedoStack((prevStack) => prevStack.slice(1));
    textRef.current = nextText;
    setState((s) => ({ ...s, text: nextText }));
    useCase.processInput(nextText, (partial) => {
      setState((s) => ({ ...s, ...partial }));
    });
  }, [redoStack, useCase]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleUndo, handleRedo]);

  const handleLoadHistory = useCallback(
    (text: string) => {
      pushUndo();
      textRef.current = text;
      setState((prev) => ({ ...prev, text }));
      useCase.processInput(text, (partial) => {
        setState((prev) => ({ ...prev, ...partial }));
      });
    },
    [useCase]
  );

  return (
    <div className="flex h-screen flex-col">
      <Toolbar onLoadHistory={handleLoadHistory} />
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={25}>
            <JsonEditor
              value={state.text}
              onChange={handleChange}
              error={state.error}
              onFormat={handleFormat}
              onMinify={handleMinify}
              onCopy={handleCopy}
              onExport={handleExport}
              onClear={handleClear}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              disabled={disabled}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <JsonTreeView
              ref={treeRef}
              tree={state.tree}
              searchTerm={state.searchTerm}
              onSearch={(term) => setState((prev) => ({ ...prev, searchTerm: term }))}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <StatusBar text={state.text} error={state.error} hasJson={hasJson} isParsing={isParsing} />
    </div>
  );
}
