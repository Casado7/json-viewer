"use client";

import { useCallback, useMemo, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
      <Card className="flex flex-1 flex-col gap-0 rounded-none border-0 min-w-0 [--card-spacing:0px]">
        <CardHeader className="flex shrink-0 flex-row items-center border-b px-3 py-2">
          <CardTitle className="text-xs font-medium text-muted-foreground m-0">
            Visor
          </CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 items-center justify-center p-0">
          <Empty>
            <EmptyTitle>Sin datos JSON</EmptyTitle>
            <EmptyDescription>
              Pega o escribe JSON en el editor para previsualizarlo aquí.
            </EmptyDescription>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-1 flex-col gap-0 rounded-none border-0 min-w-0 [--card-spacing:0px]">
      <CardHeader className="flex shrink-0 flex-row items-center gap-2 border-b px-3 py-2">
        <CardTitle className="text-xs font-medium text-muted-foreground m-0">
          Visor
        </CardTitle>
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
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
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
        <div className="flex-1 overflow-auto">
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
        </div>
      </CardContent>
    </Card>
  );
});
