"use client";

import { ChevronRight, ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JsonNode } from "@/lib/json-utils";

interface JsonTreeNodeProps {
  node: JsonNode;
  depth: number;
  searchTerm: string;
  defaultExpanded: boolean;
  expanded: boolean;
  onToggle: () => void;
  onCopy: (value: string) => void;
}

function highlightText(text: string, term: string) {
  if (!term) return text;
  const lower = text.toLowerCase();
  const lowerTerm = term.toLowerCase();
  const idx = lower.indexOf(lowerTerm);
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
      return { display: `"${node.value as string}"`, color: "text-green-600 dark:text-green-400" };
    case "number":
      return { display: String(node.value), color: "text-blue-600 dark:text-blue-400" };
    case "boolean":
      return { display: String(node.value), color: "text-orange-600 dark:text-orange-400" };
    case "null":
      return { display: "null", color: "text-red-500 dark:text-red-400" };
    default:
      return { display: "", color: "" };
  }
}

export function JsonTreeNode({
  node,
  depth,
  searchTerm,
  defaultExpanded,
  expanded,
  onToggle,
  onCopy,
}: JsonTreeNodeProps) {
  const isLeaf = node.children === null;
  const isExpandable = !isLeaf && node.size > 0;
  const indent = depth * 16;

  const hasSearchMatch = searchTerm
    ? node.key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defaultExpanded
    : false;

  const showExpanded =
    isExpandable && (expanded || (searchTerm && hasSearchMatch));

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
          onClick={() => onCopy(node.value as string)}
        >
          <Copy className="size-2.5" />
        </Button>
      </div>
    );
  }

  const preview =
    node.type === "object"
      ? `{${node.size} ${node.size === 1 ? "property" : "properties"}}`
      : `[${node.size} ${node.size === 1 ? "item" : "items"}]`;

  return (
    <div>
      <div
        className="group flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 hover:bg-muted/50"
        style={{ paddingLeft: `${8 + indent}px` }}
        onClick={onToggle}
      >
        {isExpandable ? (
          showExpanded ? (
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
      {showExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <JsonTreeNode
              key={`${child.key}-${index}`}
              node={child}
              depth={depth + 1}
              searchTerm={searchTerm}
              defaultExpanded={
                !!searchTerm &&
                (child.key?.toLowerCase().includes(searchTerm.toLowerCase()) ??
                  false)
              }
              expanded={false}
              onToggle={() => {}}
              onCopy={onCopy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function stringifyChildren(node: JsonNode): string {
  if (node.type === "object") {
    const entries = (node.children ?? []).map(
      (c) => `  ${JSON.stringify(c.key)}: ${stringifyValue(c)}`
    );
    return `{\n${entries.join(",\n")}\n}`;
  }
  const items = (node.children ?? []).map((c) => `  ${stringifyValue(c)}`);
  return `[\n${items.join(",\n")}\n]`;
}

function stringifyValue(node: JsonNode): string {
  switch (node.type) {
    case "string":
      return JSON.stringify(node.value);
    case "number":
    case "boolean":
    case "null":
      return String(node.value);
    case "object":
    case "array":
      return stringifyChildren(node);
  }
}
