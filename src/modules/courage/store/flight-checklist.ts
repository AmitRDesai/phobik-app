import { atom } from 'jotai';
import { atomWithStorage, unwrap } from 'jotai/utils';

import { storage } from '@/utils/jotai';

// Persisted as string[] since Set isn't JSON-serializable
const checkedItemsArrayAtom = atomWithStorage<string[]>(
  'flight-checklist',
  [],
  storage,
);

const syncCheckedItemsAtom = unwrap(
  checkedItemsArrayAtom,
  (prev) => prev ?? [],
);

/** Set of checked item IDs across all flight checklist phases (e.g. "before-airport:1") */
export const flightChecklistAtom = atom(
  (get) => new Set(get(syncCheckedItemsAtom)),
  (_get, set, value: Set<string>) => set(checkedItemsArrayAtom, [...value]),
);
