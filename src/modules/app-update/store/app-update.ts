import { atom } from 'jotai';

/**
 * Set by `useAppInitializer` when the running app build is below
 * `minimumVersion`. Read by the `/update-required` screen to render the
 * store-link button. `null` when no force-update is needed.
 */
export const updateRequiredAtom = atom<{
  storeUrl: string;
  minimumVersion: string;
} | null>(null);
