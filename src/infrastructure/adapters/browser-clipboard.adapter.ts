import type { ClipboardPort } from "@/core/ports/clipboard.port";

export function createBrowserClipboardAdapter(): ClipboardPort {
  return {
    async copy(text: string): Promise<void> {
      await navigator.clipboard.writeText(text);
    },
  };
}
