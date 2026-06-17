import type { JsonNode } from "@/core/domain/entities/json-node";
import { parseJson, formatJson, minifyJson, buildTree } from "@/core/domain/services/json-service";
import { searchInTree } from "@/core/domain/services/search-service";
import type { SearchMatch } from "@/core/domain/services/search-service";
import type { JsonHistoryPort } from "@/core/ports/json-history.port";
import type { ToastPort } from "@/core/ports/toast.port";
import type { ClipboardPort } from "@/core/ports/clipboard.port";

export interface JsonViewerState {
  text: string;
  tree: JsonNode | null;
  error: string | null;
  searchTerm: string;
}

export class JsonViewerUseCase {
  private debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(
    private readonly history: JsonHistoryPort,
    private readonly toast: ToastPort,
    private readonly clipboard: ClipboardPort
  ) {}

  loadInitialState(): Partial<JsonViewerState> {
    const saved = this.history.load();
    if (!saved) return {};
    try {
      const parsed = parseJson(saved);
      return { text: saved, tree: buildTree(parsed), error: null };
    } catch {
      return { text: saved };
    }
  }

  processInput(
    text: string,
    onResult: (partial: Partial<JsonViewerState>) => void
  ): void {
    const existing = this.debounceTimers.get("input");
    if (existing) clearTimeout(existing);

    this.debounceTimers.set(
      "input",
      setTimeout(() => {
        if (!text.trim()) {
          onResult({ tree: null, error: null });
          return;
        }

        try {
          const parsed = parseJson(text);
          const tree = buildTree(parsed);
          this.history.save(text);
          onResult({ tree, error: null });
        } catch (err) {
          onResult({ tree: null, error: (err as Error).message });
        }
      }, 400)
    );
  }

  format(text: string): string | null {
    try {
      const formatted = formatJson(text);
      this.toast.success("JSON formateado");
      return formatted;
    } catch {
      this.toast.error("JSON inválido");
      return null;
    }
  }

  minify(text: string): string | null {
    try {
      const minified = minifyJson(text);
      this.toast.success("JSON minificado");
      return minified;
    } catch {
      this.toast.error("JSON inválido");
      return null;
    }
  }

  async copy(text: string): Promise<void> {
    if (!text.trim()) return;
    try {
      await this.clipboard.copy(text);
      this.toast.success("Copiado al portapapeles");
    } catch {
      this.toast.error("Error al copiar");
    }
  }

  async copyValue(value: string): Promise<void> {
    try {
      await this.clipboard.copy(value);
      this.toast.success("Copiado al portapapeles");
    } catch {
      this.toast.error("Error al copiar");
    }
  }

  export(text: string): boolean {
    if (!text.trim()) return false;
    try {
      const formatted = formatJson(text);
      const blob = new Blob([formatted], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      a.click();
      URL.revokeObjectURL(url);
      this.toast.success("Archivo descargado");
      return true;
    } catch {
      this.toast.error("JSON inválido");
      return false;
    }
  }

  search(tree: JsonNode | null, term: string): SearchMatch[] {
    if (!tree || !term) return [];
    return searchInTree(tree, term);
  }

  clearState(): JsonViewerState {
    return { text: "", tree: null, error: null, searchTerm: "" };
  }

  notifyClear(): void {
    this.toast.success("Contenido limpiado");
  }

  notifyCollapse(): void {
    this.toast.success("Nodos colapsados");
  }

  notifyExpand(): void {
    this.toast.success("Nodos expandidos");
  }
}
