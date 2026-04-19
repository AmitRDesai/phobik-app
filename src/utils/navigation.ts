import type { Router } from 'expo-router';

/**
 * Unwind a nested stack back to the root route. dismissTo pops every
 * route above the target in one op; if the current nav tree has no
 * ancestor (fresh install / deep link), fall back to replace.
 * Kept in a plain module fn so try/catch doesn't block React Compiler
 * from optimizing calling components.
 */
export function dismissToRoot(router: Router) {
  try {
    const dismissTo = router.dismissTo as ((href: string) => void) | undefined;
    if (typeof dismissTo === 'function') {
      dismissTo('/');
      return;
    }
  } catch {
    // fall through to replace
  }
  router.replace('/');
}
