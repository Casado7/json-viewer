import type { JsonHistoryPort } from "@/core/ports/json-history.port";

const HISTORY_KEY = "json-viewer-history";
const MAX_ITEMS = 10;

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
      const updated = [text, ...items.filter((h) => h !== text)].slice(0, MAX_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    },

    clear(): void {
      localStorage.removeItem(HISTORY_KEY);
    },

    getAll,
  };
}
