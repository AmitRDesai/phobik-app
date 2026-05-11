import { toastAtom, type ToastConfig, type ToastType } from '@/store/toast';
import { store } from '@/utils/jotai';

let nextId = 1;
let dismissTimer: ReturnType<typeof setTimeout> | null = null;

function show(type: ToastType, config: ToastConfig | string): void {
  const resolved: ToastConfig =
    typeof config === 'string' ? { message: config } : config;
  const duration = resolved.duration ?? 3000;
  const id = nextId++;

  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
  store.set(toastAtom, {
    id,
    type,
    message: resolved.message,
    description: resolved.description,
    duration,
  });

  if (duration > 0) {
    dismissTimer = setTimeout(() => {
      const current = store.get(toastAtom);
      // Only dismiss if no newer toast has replaced this one.
      if (current?.id === id) store.set(toastAtom, null);
      dismissTimer = null;
    }, duration);
  }
}

/**
 * Imperative API for transient, non-blocking feedback. Use for confirmations
 * the user doesn't need to acknowledge ("Entry saved", "Synced", "Copied").
 * For anything requiring a choice or acknowledgement, use `dialog` instead.
 *
 * Toasts replace each other rather than stacking — firing a second toast
 * cancels the first's auto-dismiss and shows the new one.
 *
 * Pass a plain string for the simplest case, or a config object for
 * description / duration overrides:
 *
 *   toast.success('Entry saved')
 *   toast.error({ message: 'Sync failed', description: 'Will retry shortly.' })
 *   toast.info({ message: 'Sticky', duration: 0 })  // sticky until dismissed
 */
export const toast = {
  success(config: ToastConfig | string) {
    show('success', config);
  },
  info(config: ToastConfig | string) {
    show('info', config);
  },
  warning(config: ToastConfig | string) {
    show('warning', config);
  },
  error(config: ToastConfig | string) {
    show('error', config);
  },
  /** Programmatically dismiss the visible toast. */
  dismiss() {
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    store.set(toastAtom, null);
  },
};
