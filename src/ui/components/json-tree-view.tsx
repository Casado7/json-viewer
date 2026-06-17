"use client";

import { useCallback, useMemo, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/ui/components/search-bar";
import { JsonTreeNode } from "@/ui/components/json-tree-node";
import type { JsonNode } from "@/core/domain/entities/json-node";
import { searchInTree } from "@/core/domain/services/search-service";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { useUseCase } from "@/ui/providers/use-case-provider";
import { Minimize2, Maximize2 } from "lucide-react";

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
  const useCase = useUseCase();
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentSearchIdx, setCurrentSearchIdx] = useState(0);

  useEffect(() => {
    if (tree) setAllExpanded(true);
  }, [tree]);

  const collapseAllTree = useCallback(() => {
    setExpandedPaths(new Set());
    setAllExpanded(false);
    useCase.notifyCollapse();
  }, [useCase]);

  const expandAllTree = useCallback(() => {
    setAllExpanded(true);
    useCase.notifyExpand();
  }, [useCase]);

  useImperativeHandle(ref, () => ({ collapseAll: collapseAllTree, expandAll: expandAllTree }), [collapseAllTree, expandAllTree]);

  const toggleNode = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
    setAllExpanded(false);
  }, []);

  const searchResultsList = useMemo(() => {
    if (!tree || !searchTerm) return [];
    return searchInTree(tree, searchTerm);
  }, [tree, searchTerm]);

  const disabled = !tree;

  if (!tree) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b px-3 py-1.5">
          <span className="text-xs font-medium text-muted-foreground">Visor</span>
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
      <div className="flex shrink-0 items-center gap-2 border-b px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Visor</span>
        <div data-slot="button-group" className="flex">
          <Button variant="outline" size="xs" onClick={collapseAllTree} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={"border-primary/40" + (disabled ? " pointer-events-none opacity-50" : "")}>
            <Minimize2 data-icon="inline-start" />
            Colapsar
          </Button>
          <Button variant="outline" size="xs" onClick={expandAllTree} aria-disabled={disabled || undefined} data-disabled={disabled || undefined} className={"border-primary/40" + (disabled ? " pointer-events-none opacity-50" : "")}>
            <Maximize2 data-icon="inline-start" />
            Expandir
          </Button>
        </div>
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
            expandedPaths={expandedPaths}
            allExpanded={allExpanded}
            onToggle={toggleNode}
            onCopy={(value: string) => useCase.copyValue(value)}
          />
        </div>
      </ScrollArea>
    </div>
  );
});
