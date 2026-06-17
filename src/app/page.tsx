"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Toolbar } from "@/components/toolbar";
import { JsonEditor } from "@/components/json-editor";
import { JsonTreeView } from "@/components/json-tree-view";
import type { TreeViewHandle } from "@/components/json-tree-view";
import { buildTree, formatJson, minifyJson, parseJson } from "@/lib/json-utils";
import type { JsonNode } from "@/lib/json-utils";
import { toast } from "sonner";

const HISTORY_KEY = "json-viewer-history";

export default function Home() {
  const [text, setText] = useState("");
  const [tree, setTree] = useState<JsonNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const items = JSON.parse(saved) as string[];
        if (items.length > 0) {
          setText(items[0]);
        }
      } catch {}
    }
  }, []);

  const parseAndBuild = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      if (!trimmed) {
        setTree(null);
        setError(null);
        return;
      }

      try {
        const parsed = parseJson(trimmed);
        setTree(buildTree(parsed));
        setError(null);

        const history: string[] = JSON.parse(
          localStorage.getItem(HISTORY_KEY) ?? "[]"
        );
        const updated = [trimmed, ...history.filter((h) => h !== trimmed)].slice(
          0,
          10
        );
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        setError((err as Error).message);
        setTree(null);
      }
    }, 400);
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setText(value);
      parseAndBuild(value);
    },
    [parseAndBuild]
  );

  const handleFormat = useCallback(() => {
    try {
      const formatted = formatJson(text);
      setText(formatted);
      parseAndBuild(formatted);
      toast.success("JSON formatted");
    } catch {
      toast.error("Invalid JSON");
    }
  }, [text, parseAndBuild]);

  const handleMinify = useCallback(() => {
    try {
      const minified = minifyJson(text);
      setText(minified);
      parseAndBuild(minified);
      toast.success("JSON minified");
    } catch {
      toast.error("Invalid JSON");
    }
  }, [text, parseAndBuild]);

  const handleCopy = useCallback(() => {
    if (!text.trim()) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
    setTree(null);
    setError(null);
    setSearchTerm("");
  }, []);

  const handleExport = useCallback(() => {
    if (!text.trim()) return;
    try {
      const formatted = formatJson(text);
      const blob = new Blob([formatted], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("File downloaded");
    } catch {
      toast.error("Invalid JSON");
    }
  }, [text]);

  const treeRef = useRef<TreeViewHandle>(null);
  const hasJson = !!tree;

  return (
    <div className="flex h-screen flex-col">
      <Toolbar
        onFormat={handleFormat}
        onMinify={handleMinify}
        onCopy={handleCopy}
        onClear={handleClear}
        onCollapseAll={() => treeRef.current?.collapseAll()}
        onExpandAll={() => treeRef.current?.expandAll()}
        onExport={handleExport}
        hasJson={hasJson}
      />
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal" className="h-full">
          <ResizablePanel defaultSize={40} minSize={25}>
            <JsonEditor
              value={text}
              onChange={handleChange}
              error={error}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <JsonTreeView
              ref={treeRef}
              tree={tree}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
