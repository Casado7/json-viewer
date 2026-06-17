export interface JsonHistoryPort {
  load(): string | null;
  save(text: string): void;
  clear(): void;
  getAll(): string[];
}
