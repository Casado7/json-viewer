import { toast } from "sonner";
import type { ToastPort } from "@/core/ports/toast.port";

export function createSonnerToastAdapter(): ToastPort {
  return {
    success(message: string): void {
      toast.success(message);
    },
    error(message: string): void {
      toast.error(message);
    },
  };
}
