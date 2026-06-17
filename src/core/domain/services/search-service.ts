import type { JsonNode } from "@/core/domain/entities/json-node";
import { getValuePreview } from "@/core/domain/services/json-service";

export interface SearchMatch {
  path: string;
  key: string;
  value: string;
}

export function searchInTree(
  node: JsonNode,
  term: string,
  path: string = "",
  results: SearchMatch[] = []
): SearchMatch[] {
  if (!term) return results;

  const lowerTerm = term.toLowerCase();
  const currentPath = node.key !== null ? (path ? `${path}.${node.key}` : node.key) : path;

  const keyMatch = node.key?.toLowerCase().includes(lowerTerm);
  const valueMatch =
    typeof node.value === "string" && node.value.toLowerCase().includes(lowerTerm);
  const rawValueMatch =
    typeof node.value === "number" || typeof node.value === "boolean"
      ? String(node.value).toLowerCase().includes(lowerTerm)
      : false;

  if (keyMatch || valueMatch || rawValueMatch) {
    results.push({
      path: currentPath,
      key: node.key ?? "(root)",
      value: getValuePreview(node.value),
    });
  }

  if (node.children) {
    for (const child of node.children) {
      searchInTree(child, term, currentPath, results);
    }
  }

  return results;
}

export function hasSearchMatch(node: JsonNode, term: string): boolean {
  if (!term) return false;
  const lower = term.toLowerCase();
  if (node.key?.toLowerCase().includes(lower)) return true;
  if (typeof node.value === "string" && node.value.toLowerCase().includes(lower)) return true;
  if (typeof node.value === "number" || typeof node.value === "boolean") {
    if (String(node.value).toLowerCase().includes(lower)) return true;
  }
  return false;
}
