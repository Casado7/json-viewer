export type JsonNodeType = "object" | "array" | "string" | "number" | "boolean" | "null";

export interface JsonNode {
  key: string | null;
  value: unknown;
  type: JsonNodeType;
  children: JsonNode[] | null;
  size: number;
}
