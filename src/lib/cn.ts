import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind / NativeWind class strings with proper conflict resolution.
 *
 * `clsx` joins; `tailwind-merge` deduplicates by conflict group (e.g. it
 * keeps the LAST `font-*` and drops earlier ones, same for `text-Npx`,
 * `bg-*`, etc.). Use this in component primitives that mix internal default
 * utilities with a caller-provided `className` so the caller wins without
 * needing the `!` important modifier.
 *
 * Convention: pass internal defaults first, caller `className` last.
 *
 *   cn('text-[15px] font-normal text-foreground', userClassName)
 *
 * Authoritative recommendation from the NativeWind maintainers — see
 * https://www.nativewind.dev/docs/core-concepts/style-specificity and
 * https://github.com/nativewind/nativewind/discussions/1323.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
