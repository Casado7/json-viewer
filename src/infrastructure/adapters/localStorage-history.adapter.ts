import type { JsonHistoryPort } from "@/core/ports/json-history.port";

const HISTORY_KEY = "json-viewer-history";
const MAX_ITEMS = 10;

function normalize(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json));
  } catch {
    return json;
  }
}

export function createLocalStorageHistoryAdapter(): JsonHistoryPort {
  function getAll(): string[] {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    } catch {
      return [];
    }
  }

  return {
    load(): string | null {
      const items = getAll();
      return items.length > 0 ? items[0] : null;
    },

    save(text: string): void {
      const items = getAll();
      const norm = normalize(text);
      const filtered = items.filter((h) => normalize(h) !== norm);
      const updated = [text, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    },

    clear(): void {
      localStorage.removeItem(HISTORY_KEY);
    },

    getAll,
  };
}
