import { User } from '@/models/user.model';
import { atom } from 'jotai';

// User data atom (in-memory only)
// Better Auth handles token storage via expo-secure-store
export const userAtom = atom<User | null>(null);
