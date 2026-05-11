import { atom } from 'jotai';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastState {
  id: number;
  type: ToastType;
  message: string;
  /** Optional secondary line below the message. */
  description?: string;
  /** Auto-dismiss after N ms. 0 = sticky. Default: 3000. */
  duration: number;
}

export interface ToastConfig {
  message: string;
  description?: string;
  /** Auto-dismiss after N ms. 0 = sticky. Default: 3000. */
  duration?: number;
}

/**
 * The currently visible toast (or null). The container reads this atom and
 * renders + animates a single toast at a time — newer toasts replace
 * older ones rather than stacking (intentional: the app doesn't surface
 * enough transient feedback to need a stack, and a single line is calmer).
 */
export const toastAtom = atom<ToastState | null>(null);
