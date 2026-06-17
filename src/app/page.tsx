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
import type { TreeViewHandle } from "@/ui/components/json-tree-view";
import { useUseCase } from "@/ui/providers/use-case-provider";

export default function Home() {
  const useCase = useUseCase();
  const textRef = useRef("");
  const treeRef = useRef<TreeViewHandle>(null);
  const [state, setState] = useState({
    text: "",
    tree: null as JsonNode | null,
    error: null as string | null,
    searchTerm: "",
  });
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    const initial = useCase.loadInitialState();
    if (initial.text !== undefined) {
      textRef.current = initial.text;
      setState((prev) => ({ ...prev, ...initial }));
    }
  }, [useCase]);

  const handleChange = useCallback(
    (value: string) => {
      textRef.current = value;
      setState((prev) => ({ ...prev, text: value }));
      setIsParsing(true);
      useCase.processInput(value, (partial) => {
        setState((prev) => ({ ...prev, ...partial }));
        setIsParsing(false);
      });
    },
    [useCase]
  );

  const handleFormat = useCallback(() => {
    const formatted = useCase.format(textRef.current);
    if (formatted !== null) {
      textRef.current = formatted;
      setState((prev) => ({ ...prev, text: formatted }));
      useCase.processInput(formatted, (partial) => {
        setState((prev) => ({ ...prev, ...partial }));
      });
    }
  }, [useCase]);

  const handleMinify = useCallback(() => {
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
    textRef.current = "";
    setState({ text: "", tree: null, error: null, searchTerm: "" });
    useCase.notifyClear();
  }, [useCase]);

  const hasJson = !!state.tree;

  return (
    <div className="flex h-screen flex-col">
      <Toolbar
        onFormat={handleFormat}
        onMinify={handleMinify}
        onCopy={handleCopy}
        onClear={handleClear}
        onCollapseAll={() => {
          treeRef.current?.collapseAll();
          useCase.notifyCollapse();
        }}
        onExpandAll={() => {
          treeRef.current?.expandAll();
          useCase.notifyExpand();
        }}
        onExport={handleExport}
        hasJson={hasJson}
        isParsing={isParsing}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={25}>
            <JsonEditor
              value={state.text}
              onChange={handleChange}
              error={state.error}
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
