import { User } from '@/models/user.model';
import { storage } from '@/utils/jotai';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const userTokenAtom = atomWithStorage<{
  accessToken: string;
  refreshToken: string;
} | null>('userToken', null, storage, {
  getOnInit: true,
});

export const userAtom = atom<User | null>(null);
