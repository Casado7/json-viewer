"use client";

import { ChevronRight, ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JsonNode } from "@/core/domain/entities/json-node";
import { stringifyChildren } from "@/core/domain/services/json-service";
import { hasSearchMatch } from "@/core/domain/services/search-service";

interface JsonTreeNodeProps {
  node: JsonNode;
  depth: number;
  path: string;
  searchTerm: string;
  expandedPaths: Set<string>;
  allExpanded: boolean;
  onToggle: (path: string) => void;
  onCopy: (value: string) => void;
}

function highlightText(text: string, term: string) {
  if (!term) return text;
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  const idx = lower.indexOf(termLower);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-300/60 dark:bg-yellow-500/40">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

function formatValue(node: JsonNode): { display: string; color: string } {
  switch (node.type) {
    case "string":
      return { display: `"${node.value as string}"`, color: "text-json-string" };
    case "number":
      return { display: String(node.value), color: "text-json-number" };
    case "boolean":
      return { display: String(node.value), color: "text-json-boolean" };
    case "null":
      return { display: "null", color: "text-json-null" };
    default:
      return { display: "", color: "" };
  }
}

export function JsonTreeNode({
  node,
  depth,
  path,
  searchTerm,
  expandedPaths,
  allExpanded,
  onToggle,
  onCopy,
}: JsonTreeNodeProps) {
  const isLeaf = node.children === null;
  const isExpandable = !isLeaf && node.size > 0;
  const indent = depth * 16;
  const isExpanded = allExpanded || expandedPaths.has(path);
  const matchSelf = hasSearchMatch(node, searchTerm);
  const shouldExpand = isExpanded || (!!searchTerm && matchSelf);

  if (isLeaf) {
    const fmt = formatValue(node);
    return (
      <div
        className="group flex items-start gap-1 rounded px-1 py-0.5 hover:bg-muted/50"
        style={{ paddingLeft: `${12 + indent}px` }}
      >
        {node.key !== null && (
          <span className="font-mono text-xs font-medium text-foreground shrink-0">
            {highlightText(node.key, searchTerm)}
            <span className="text-muted-foreground">: </span>
          </span>
        )}
        <span className={`font-mono text-xs ${fmt.color}`}>
          {highlightText(fmt.display, searchTerm)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-4 opacity-0 group-hover:opacity-100 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(node.value as string);
          }}
        >
          <Copy className="size-2.5" />
        </Button>
      </div>
    );
  }

  const preview =
    node.type === "object"
      ? `{${node.size} ${node.size === 1 ? "propiedad" : "propiedades"}}`
      : `[${node.size} ${node.size === 1 ? "elemento" : "elementos"}]`;

  return (
    <div>
      <div
        className="group flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 hover:bg-muted/50"
        style={{ paddingLeft: `${8 + indent}px` }}
        onClick={() => onToggle(path)}
      >
        {isExpandable ? (
          shouldExpand ? (
            <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="size-3 shrink-0" />
        )}
        {node.key !== null && (
          <span className="font-mono text-xs font-medium text-foreground shrink-0">
            {highlightText(node.key, searchTerm)}
            <span className="text-muted-foreground">: </span>
          </span>
        )}
        <span className="font-mono text-xs text-muted-foreground">
          {preview}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-4 opacity-0 group-hover:opacity-100 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(stringifyChildren(node));
          }}
        >
          <Copy className="size-2.5" />
        </Button>
      </div>
      {shouldExpand && node.children && (
        <div>
          {node.children.map((child, index) => {
            const childPath = path ? `${path}.${child.key ?? index}` : String(child.key ?? index);
            return (
              <JsonTreeNode
                key={childPath}
                node={child}
                depth={depth + 1}
                path={childPath}
                searchTerm={searchTerm}
                expandedPaths={expandedPaths}
                allExpanded={allExpanded}
                onToggle={onToggle}
                onCopy={onCopy}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
