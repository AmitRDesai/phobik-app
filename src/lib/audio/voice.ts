import { atomWithStorage } from 'jotai/utils';
import { storage } from '@/utils/jotai';

/**
 * Narrator voice for any audio content that supports male/female variants
 * (meditations today, future audio features later). `null` = the user hasn't
 * picked yet; consumers should prompt on first play and persist the choice.
 */
export type AudioVoice = 'male' | 'female';

export const audioVoiceAtom = atomWithStorage<AudioVoice | null>(
  'audio-voice',
  null,
  storage,
);
