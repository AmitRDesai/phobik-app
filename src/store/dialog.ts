import { atom } from 'jotai';
import type { ComponentType } from 'react';

export type DialogResult<T = string | boolean> = T | undefined;

export interface DialogButton<T = string | boolean> {
  label: string;
  value: DialogResult<T>;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export type DialogType = 'error' | 'info' | 'loading' | 'custom';

export interface CustomDialogProps<T = string | boolean> {
  close: (result?: DialogResult<T>) => void;
}

export interface DialogState {
  type: DialogType;
  title?: string;
  message?: string;
  buttons: DialogButton[];
  customComponent?: ComponentType<any>;
  customProps?: Record<string, unknown>;
  resolve: (result: DialogResult) => void;
}

export interface DialogConfig<T = string | boolean> {
  title: string;
  message: string;
  buttons?: DialogButton<T>[];
}

export interface LoadingConfig {
  message?: string;
}

export interface CustomDialogConfig<P extends CustomDialogProps> {
  component: ComponentType<P>;
  props?: Omit<P, keyof CustomDialogProps>;
}

// Transient UI state — never persisted
export const dialogAtom = atom<DialogState | null>(null);
