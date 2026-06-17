"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { JsonViewerUseCase } from "@/core/application/json-viewer.usecase";
import { createLocalStorageHistoryAdapter } from "@/infrastructure/adapters/localStorage-history.adapter";
import { createSonnerToastAdapter } from "@/infrastructure/adapters/sonner-toast.adapter";
import { createBrowserClipboardAdapter } from "@/infrastructure/adapters/browser-clipboard.adapter";

const UseCaseContext = createContext<JsonViewerUseCase | null>(null);

export function UseCaseProvider({ children }: { children: ReactNode }) {
  const useCase = useMemo(
    () =>
      new JsonViewerUseCase(
        createLocalStorageHistoryAdapter(),
        createSonnerToastAdapter(),
        createBrowserClipboardAdapter()
      ),
    []
  );

  return (
    <UseCaseContext value={useCase}>{children}</UseCaseContext>
  );
}

export function useUseCase(): JsonViewerUseCase {
  const ctx = useContext(UseCaseContext);
  if (!ctx) throw new Error("useUseCase must be used within UseCaseProvider");
  return ctx;
}
