import {
  dialogAtom,
  type CustomDialogConfig,
  type CustomDialogProps,
  type DialogConfig,
  type DialogResult,
  type LoadingConfig,
} from '@/store/dialog';
import { store } from '@/utils/jotai';

function dismissCurrent() {
  const current = store.get(dialogAtom);
  if (current) {
    current.resolve(undefined);
    store.set(dialogAtom, null);
  }
}

export const dialog = {
  error<T = string | boolean>(
    config: DialogConfig<T>,
  ): Promise<DialogResult<T>> {
    dismissCurrent();
    return new Promise<DialogResult<T>>((resolve) => {
      store.set(dialogAtom, {
        type: 'error',
        title: config.title,
        message: config.message,
        buttons: (config.buttons as any) ?? [
          { label: 'OK', value: 'ok', variant: 'primary' },
        ],
        resolve: resolve as (result: DialogResult) => void,
      });
    });
  },

  info<T = string | boolean>(
    config: DialogConfig<T>,
  ): Promise<DialogResult<T>> {
    dismissCurrent();
    return new Promise<DialogResult<T>>((resolve) => {
      store.set(dialogAtom, {
        type: 'info',
        title: config.title,
        message: config.message,
        buttons: (config.buttons as any) ?? [
          { label: 'OK', value: 'ok', variant: 'primary' },
        ],
        resolve: resolve as (result: DialogResult) => void,
      });
    });
  },

  loading(config?: LoadingConfig): () => void {
    dismissCurrent();
    store.set(dialogAtom, {
      type: 'loading',
      message: config?.message ?? 'Please wait...',
      buttons: [],
      resolve: () => {},
    });
    return () => dialog.close();
  },

  open<P extends CustomDialogProps>(
    config: CustomDialogConfig<P>,
  ): Promise<DialogResult> {
    dismissCurrent();
    return new Promise<DialogResult>((resolve) => {
      store.set(dialogAtom, {
        type: 'custom',
        buttons: [],
        customComponent: config.component,
        customProps: config.props as Record<string, unknown> | undefined,
        resolve,
      });
    });
  },

  close(result?: DialogResult) {
    const current = store.get(dialogAtom);
    if (current) {
      current.resolve(result);
      store.set(dialogAtom, null);
    }
  },
};
