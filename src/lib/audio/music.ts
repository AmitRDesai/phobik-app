import { atomWithStorage } from 'jotai/utils';
import { storage } from '@/utils/jotai';

/**
 * Narration volume (0..1) — the spoken/guided track layered over a background
 * bed. Independent from the bed volume so the user can balance the two. `0` =
 * narration silent. On-device only, mirroring {@link audioVoiceAtom} in
 * `./voice`.
 */
export const voiceVolumeAtom = atomWithStorage<number>(
  'voice-volume',
  1,
  storage,
);

/**
 * Background-music bed volume (0..1), shared across every practice that layers
 * a looping bed under its narration. `0` = bed effectively off. On-device only
 * (no cross-device sync), mirroring {@link audioVoiceAtom} in `./voice`.
 */
export const backgroundMusicVolumeAtom = atomWithStorage<number>(
  'background-music-volume',
  0.4,
  storage,
);
