import { atom } from 'jotai';

/** Set of checked item IDs across all flight checklist phases (e.g. "before-airport:1") */
export const flightChecklistAtom = atom(new Set<string>());
