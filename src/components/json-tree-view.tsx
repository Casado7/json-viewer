"use client";

import { useCallback, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchBar } from "@/components/search-bar";
import { JsonTreeNode } from "@/components/json-tree-node";
import type { JsonNode } from "@/lib/json-utils";
import { searchInTree } from "@/lib/json-utils";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { toast } from "sonner";

export interface TreeViewHandle {
  collapseAll: () => void;
  expandAll: () => void;
}

interface JsonTreeViewProps {
  tree: JsonNode | null;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const JsonTreeView = forwardRef<TreeViewHandle, JsonTreeViewProps>(
  function JsonTreeView({ tree, searchTerm, onSearch }, ref) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentSearchIdx, setCurrentSearchIdx] = useState(0);

  const collapseAllTree = useCallback(() => {
    setExpandedNodes(new Set());
    setAllExpanded(false);
  }, []);

  const expandAllTree = useCallback(() => {
    setAllExpanded(true);
  }, []);

  useImperativeHandle(ref, () => ({ collapseAll: collapseAllTree, expandAll: expandAllTree }), [collapseAllTree, expandAllTree]);

  const handleCopy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const toggleNode = useCallback(
    (path: string) => {
      setExpandedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(path)) next.delete(path);
        else next.add(path);
        return next;
      });
    },
    []
  );

  const searchResultsList = useMemo(() => {
    if (!tree || !searchTerm) return [];
    const results = searchInTree(tree, searchTerm);
    setSearchResults(results.map((r) => r.path));
    return results;
  }, [tree, searchTerm]);

  if (!tree) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b px-3 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Viewer
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Empty>
            <EmptyTitle>No JSON data</EmptyTitle>
            <EmptyDescription>
              Paste or type JSON in the editor to preview it here.
            </EmptyDescription>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Viewer
        </span>
      </div>
      <SearchBar
        onSearch={onSearch}
        resultCount={searchResultsList.length}
        currentIndex={currentSearchIdx}
        onNext={() =>
          setCurrentSearchIdx((p) => (p + 1) % Math.max(searchResultsList.length, 1))
        }
        onPrev={() =>
          setCurrentSearchIdx(
            (p) =>
              (p - 1 + Math.max(searchResultsList.length, 1)) %
              Math.max(searchResultsList.length, 1)
          )
        }
      />
      <ScrollArea className="flex-1">
        <div className="py-2">
          <JsonTreeNode
            node={tree}
            depth={0}
            searchTerm={searchTerm}
            defaultExpanded={allExpanded}
            expanded={
              allExpanded || expandedNodes.has(tree.key ?? "(root)")
            }
            onToggle={() => toggleNode(tree.key ?? "(root)")}
            onCopy={handleCopy}
          />
        </div>
      </ScrollArea>
    </div>
  );
});
