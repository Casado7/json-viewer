import type { JsonNode, JsonNodeType } from "@/core/domain/entities/json-node";

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

export function stringifyChildren(node: JsonNode): string {
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
