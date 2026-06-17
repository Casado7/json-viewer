export type JsonNodeType = "object" | "array" | "string" | "number" | "boolean" | "null";

export interface JsonNode {
  key: string | null;
  value: unknown;
  type: JsonNodeType;
  children: JsonNode[] | null;
  size: number;
}

function getType(value: unknown): JsonNodeType {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  switch (typeof value) {
    case "object":
      return "object";
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "string";
  }
}

export function buildTree(value: unknown, key: string | null = null): JsonNode {
  const type = getType(value);

  if (type === "object") {
    const obj = value as Record<string, unknown>;
    const entries = Object.entries(obj);
    return {
      key,
      value,
      type,
      children: entries.map(([k, v]) => buildTree(v, k)),
      size: entries.length,
    };
  }

  if (type === "array") {
    const arr = value as unknown[];
    return {
      key,
      value,
      type,
      children: arr.map((item, index) => buildTree(item, String(index))),
      size: arr.length,
    };
  }

  return { key, value, type, children: null, size: 0 };
}

export function parseJson(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("JSON input is empty");
  return JSON.parse(trimmed);
}

export function formatJson(text: string): string {
  const parsed = parseJson(text);
  return JSON.stringify(parsed, null, 2);
}

export function minifyJson(text: string): string {
  const parsed = parseJson(text);
  return JSON.stringify(parsed);
}

export function getValuePreview(value: unknown, maxLen = 50): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (value.length > maxLen) return `"${value.slice(0, maxLen)}..."`;
    return `"${value}"`;
  }
  return "";
}

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

export function stringifyNode(node: JsonNode): string {
  switch (node.type) {
    case "null":
      return "null";
    case "boolean":
    case "number":
      return String(node.value);
    case "string":
      return JSON.stringify(node.value);
    case "object":
      if (node.children && node.children.length > 0) {
        const entries = node.children.map(
          (child) => `${JSON.stringify(child.key)}: ${stringifyNode(child)}`
        );
        return `{ ${entries.join(", ")} }`;
      }
      return "{}";
    case "array":
      if (node.children && node.children.length > 0) {
        const items = node.children.map((child) => stringifyNode(child));
        return `[ ${items.join(", ")} ]`;
      }
      return "[]";
  }
}
