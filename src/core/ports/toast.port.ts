export interface ToastPort {
  success(message: string): void;
  error(message: string): void;
}
