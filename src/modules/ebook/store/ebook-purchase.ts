import { atomWithStorage } from 'jotai/utils';

import { storage } from '@/utils/jotai';

// NOTE: Placeholder for in-app purchase. Currently uses local state only.
export const ebookPurchasedAtom = atomWithStorage<boolean>(
  'ebook-purchased',
  false,
  storage,
);

// Show intro on first ebook open, then go straight to book index
export const ebookIntroSeenAtom = atomWithStorage<boolean>(
  'ebook-intro-seen',
  false,
  storage,
);

// Last chapter the user was reading
export const ebookLastChapterAtom = atomWithStorage<number | null>(
  'ebook-last-chapter',
  null,
  storage,
);

// Chapters marked as completed
export const ebookCompletedChaptersAtom = atomWithStorage<number[]>(
  'ebook-completed-chapters',
  [],
  storage,
);
