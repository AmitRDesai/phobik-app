import { atom } from 'jotai';

// Transient body scan state — not persisted to DB (ephemeral UI interaction)
export const selectedBodyAreaAtom = atom<string | null>(null);
export const selectedSensationAttrsAtom = atom<Record<string, string>>({});
