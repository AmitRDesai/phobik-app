import {
  CURATED_SOUNDSCAPES,
  type SoundscapeTrack,
} from '../data/curated-soundscapes';
import { MOODS, type SoundscapeMood } from '../data/sound-studio';

export type SoundscapeRow = SoundscapeTrack;

export type MoodGroup = {
  mood: SoundscapeMood;
  soundscapes: SoundscapeTrack[];
};

function buildGroupedByMood(): MoodGroup[] {
  const byMood = new Map<SoundscapeMood, SoundscapeTrack[]>();
  for (const row of CURATED_SOUNDSCAPES) {
    const list = byMood.get(row.mood) ?? [];
    list.push(row);
    byMood.set(row.mood, list);
  }
  for (const list of byMood.values()) {
    list.sort((a, b) => a.orderInMood - b.orderInMood);
  }
  return MOODS.map((m) => ({
    mood: m.id,
    soundscapes: byMood.get(m.id) ?? [],
  }));
}

const GROUPED_BY_MOOD = buildGroupedByMood();

export function useSoundscapeHome() {
  const groupedByMood = GROUPED_BY_MOOD;

  return {
    soundscapes: CURATED_SOUNDSCAPES,
    groupedByMood,
    isLoading: false,
    error: null as Error | null,
  };
}
