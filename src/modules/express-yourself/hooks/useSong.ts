import { useListSounds, type SoundSource } from '@/hooks/sound-generation';

// Express Yourself is one source of the shared sound pipeline. These thin
// wrappers keep the existing screen API stable while delegating to the
// canonical hooks in `@/hooks/sound-generation`.
export { useSound as useSong } from '@/hooks/sound-generation';
export type { SoundRecord as SongRecord } from '@/hooks/sound-generation';

const SOURCE: SoundSource = 'express-yourself';

/** The user's Express Yourself songs only (not AI Studio creations). */
export function useListSongs() {
  return useListSounds({ source: SOURCE });
}
