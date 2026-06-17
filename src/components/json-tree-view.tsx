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
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentSearchIdx, setCurrentSearchIdx] = useState(0);

  const collapseAllTree = useCallback(() => {
    setExpandedPaths(new Set());
    setAllExpanded(false);
  }, []);

  const expandAllTree = useCallback(() => {
    setAllExpanded(true);
  }, []);

  useImperativeHandle(ref, () => ({ collapseAll: collapseAllTree, expandAll: expandAllTree }), [collapseAllTree, expandAllTree]);

  const toggleNode = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const displayExpanded = useMemo(() => {
    if (allExpanded) {
      return new Set<string>(["_all_"]);
    }
    return expandedPaths;
  }, [allExpanded, expandedPaths]);

  const searchResultsList = useMemo(() => {
    if (!tree || !searchTerm) return [];
    return searchInTree(tree, searchTerm);
  }, [tree, searchTerm]);

  if (!tree) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b px-3 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Viewer
          </span>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Empty>
            <EmptyTitle>Sin datos JSON</EmptyTitle>
            <EmptyDescription>
              Pega o escribe JSON en el editor para previsualizarlo aquí.
            </EmptyDescription>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-1.5">
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
            path={tree.key ?? "(root)"}
            searchTerm={searchTerm}
            expandedPaths={displayExpanded}
            onToggle={toggleNode}
            onCopy={async (value: string) => {
              try {
                await navigator.clipboard.writeText(value);
                toast.success("Copiado al portapapeles");
              } catch {
                toast.error("Error al copiar");
              }
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
});
