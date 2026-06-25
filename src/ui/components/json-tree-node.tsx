"use client";

import { ChevronRight, ChevronDown, Copy, ExternalLink, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { JsonNode } from "@/core/domain/entities/json-node";
import { stringifyChildren } from "@/core/domain/services/json-service";
import { hasSearchMatch } from "@/core/domain/services/search-service";
import { toast } from "sonner";

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

const typeBadge: Record<string, { color: string; label: string }> = {
  string: { color: "text-json-string border-json-string/30", label: "string" },
  number: { color: "text-json-number border-json-number/30", label: "number" },
  boolean: { color: "text-json-true border-json-true/30", label: "boolean" },
  null: { color: "text-json-null border-json-null/30", label: "null" },
};

function TypeBadge({ type }: { type: string }) {
  const b = typeBadge[type];
  if (!b) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-medium leading-none ${b.color}`}
    >
      {b.label}
    </span>
  );
}

function formatValue(node: JsonNode): { display: string; color: string } {
  switch (node.type) {
    case "string":
      return { display: `"${node.value as string}"`, color: "text-json-string" };
    case "number":
      return { display: String(node.value), color: "text-json-number" };
    case "boolean":
      return {
        display: String(node.value),
        color: node.value === true ? "text-json-true" : "text-json-false",
      };
    case "null":
      return { display: "null", color: "text-json-null" };
    default:
      return { display: "", color: "" };
  }
}

function isUrl(value: unknown): value is string {
  return typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"));
}

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"];

function isImageUrl(value: unknown): value is string {
  if (!isUrl(value)) return false;
  const url = (value as string).toLowerCase();
  return IMAGE_EXT.some((ext) => url.includes(`.${ext}`));
}

function handleOpenUrl(value: unknown) {
  if (isUrl(value)) {
    window.open(value, "_blank", "noopener,noreferrer");
    toast.success("Enlace abierto");
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
    const [imgLoading, setImgLoading] = useState(true);
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="group flex items-start gap-1.5 rounded px-1 py-0.5 hover:bg-muted/50"
            style={{ paddingLeft: `${12 + indent}px` }}
          >
            {node.key !== null && (
              <span className="font-mono text-xs font-medium text-foreground shrink-0">
                {highlightText(node.key, searchTerm)}
                <span className="text-muted-foreground">: </span>
              </span>
            )}
            {isImageUrl(node.value) ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    className={`font-mono text-xs ${fmt.color} text-left cursor-pointer hover:underline`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenUrl(node.value);
                    }}
                  >
                    {highlightText(fmt.display, searchTerm)}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-[500px] p-0 overflow-hidden" side="right" align="start">
                  <div className="aspect-[4/3] relative">
                    {imgLoading && <Skeleton className="absolute inset-0 rounded-none" />}
                    <img
                      src={node.value as string}
                      alt="Preview"
                      className={`absolute inset-0 w-full h-full object-contain ${imgLoading ? "hidden" : "block"}`}
                      onLoad={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)}
                    />
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
              <button
                className={`font-mono text-xs ${fmt.color} text-left cursor-pointer hover:underline`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isUrl(node.value)) {
                    handleOpenUrl(node.value);
                  } else {
                    onCopy(node.value as string);
                  }
                }}
              >
                {highlightText(fmt.display, searchTerm)}
              </button>
            )}
            <TypeBadge type={node.type} />
            {isUrl(node.value) && (
              <Button
                variant="ghost"
                size="icon"
                className="size-4 opacity-0 group-hover:opacity-100 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenUrl(node.value);
                }}
              >
                <ExternalLink className="size-2.5 text-primary" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-4 opacity-0 group-hover:opacity-100 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(node.value as string);
              }}
            >
              <Copy className="size-2.5" />
            </Button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuItem onClick={() => onCopy(node.value as string)}>
            <Copy className="size-4" />
            <span className="ml-2">Copiar valor</span>
          </ContextMenuItem>
          {isUrl(node.value) && (
            <ContextMenuItem onClick={() => handleOpenUrl(node.value)}>
              <ExternalLink className="size-4" />
              <span className="ml-2">Abrir enlace</span>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  const preview =
    node.type === "object"
      ? `{${node.size} ${node.size === 1 ? "propiedad" : "propiedades"}}`
      : `[${node.size} ${node.size === 1 ? "elemento" : "elementos"}]`;

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
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
              className="size-4 opacity-0 group-hover:opacity-100 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(stringifyChildren(node));
              }}
            >
              <Copy className="size-2.5" />
            </Button>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuItem onClick={() => onCopy(stringifyChildren(node))}>
            <Code className="size-4" />
            <span className="ml-2">Copiar como JSON</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
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
