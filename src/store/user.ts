import { User } from '@/models/user.model';
import { storage } from '@/utils/jotai';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// User data atom (in-memory only)
// Better Auth handles token storage via expo-secure-store
export const userAtom = atom<User | null>(null);

export const isReturningUserAtom = atomWithStorage<boolean>(
  'returning-user',
  false,
  storage,
);
