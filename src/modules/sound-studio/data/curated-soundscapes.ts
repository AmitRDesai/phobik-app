import type { SoundscapeBand, SoundscapeMood } from './sound-studio';

export type SoundscapeTrack = {
  /** Stable kebab-case identifier (URL segment for the player route). */
  slug: string;
  /** Display title. */
  title: string;
  /** Optional small eyebrow above the title. */
  eyebrow?: string;
  /** Optional short description shown on the player screen. */
  description?: string;
  mood: SoundscapeMood;
  band: SoundscapeBand;
  /** Key into the audio_asset table — feeds `useAudioSource()`. */
  audioAssetKey: string;
  orderInMood: number;
  orderInBand: number;
};

const DEFAULT_EYEBROW = '432 Hz';

const RAW: Omit<SoundscapeTrack, 'eyebrow'>[] = [
  // Sleep & Restore — delta
  {
    slug: 'sleep-and-restore-hush-at-dusk',
    title: 'Hush At Dusk',
    mood: 'sleep_and_restore',
    band: 'delta',
    audioAssetKey: 'curated-sleep-and-restore-hush-at-dusk',
    orderInMood: 0,
    orderInBand: 0,
  },
  {
    slug: 'sleep-and-restore-hush-at-dusk-2',
    title: 'Hush At Dusk II',
    mood: 'sleep_and_restore',
    band: 'delta',
    audioAssetKey: 'curated-sleep-and-restore-hush-at-dusk-2',
    orderInMood: 1,
    orderInBand: 1,
  },
  {
    slug: 'sleep-and-restore-liminal-sleep-drift',
    title: 'Liminal Sleep Drift',
    mood: 'sleep_and_restore',
    band: 'delta',
    audioAssetKey: 'curated-sleep-and-restore-liminal-sleep-drift',
    orderInMood: 2,
    orderInBand: 2,
  },
  {
    slug: 'sleep-and-restore-liminal-sleep-drift-2',
    title: 'Liminal Sleep Drift II',
    mood: 'sleep_and_restore',
    band: 'delta',
    audioAssetKey: 'curated-sleep-and-restore-liminal-sleep-drift-2',
    orderInMood: 3,
    orderInBand: 3,
  },
  {
    slug: 'sleep-and-restore-moonroom-drift',
    title: 'Moonroom Drift',
    mood: 'sleep_and_restore',
    band: 'delta',
    audioAssetKey: 'curated-sleep-and-restore-moonroom-drift',
    orderInMood: 4,
    orderInBand: 4,
  },
  {
    slug: 'sleep-and-restore-moonroom-drift-2',
    title: 'Moonroom Drift II',
    mood: 'sleep_and_restore',
    band: 'delta',
    audioAssetKey: 'curated-sleep-and-restore-moonroom-drift-2',
    orderInMood: 5,
    orderInBand: 5,
  },

  // Healing & Reflection — alpha
  {
    slug: 'healing-and-reflection-safe-harbor-drift',
    title: 'Safe Harbor Drift',
    mood: 'healing_and_reflection',
    band: 'alpha',
    audioAssetKey: 'curated-healing-and-reflection-safe-harbor-drift',
    orderInMood: 0,
    orderInBand: 0,
  },
  {
    slug: 'healing-and-reflection-safe-harbor-drift-2',
    title: 'Safe Harbor Drift II',
    mood: 'healing_and_reflection',
    band: 'alpha',
    audioAssetKey: 'curated-healing-and-reflection-safe-harbor-drift-2',
    orderInMood: 1,
    orderInBand: 1,
  },
  {
    slug: 'healing-and-reflection-safe-harbor-field',
    title: 'Safe Harbor Field',
    mood: 'healing_and_reflection',
    band: 'alpha',
    audioAssetKey: 'curated-healing-and-reflection-safe-harbor-field',
    orderInMood: 2,
    orderInBand: 2,
  },
  {
    slug: 'healing-and-reflection-safe-harbor-field-2',
    title: 'Safe Harbor Field II',
    mood: 'healing_and_reflection',
    band: 'alpha',
    audioAssetKey: 'curated-healing-and-reflection-safe-harbor-field-2',
    orderInMood: 3,
    orderInBand: 3,
  },
  {
    slug: 'healing-and-reflection-six-safe-rooms',
    title: 'Six Safe Rooms',
    mood: 'healing_and_reflection',
    band: 'alpha',
    audioAssetKey: 'curated-healing-and-reflection-six-safe-rooms',
    orderInMood: 4,
    orderInBand: 4,
  },
  {
    slug: 'healing-and-reflection-six-safe-rooms-2',
    title: 'Six Safe Rooms II',
    mood: 'healing_and_reflection',
    band: 'alpha',
    audioAssetKey: 'curated-healing-and-reflection-six-safe-rooms-2',
    orderInMood: 5,
    orderInBand: 5,
  },

  // Calm & Reset — theta
  {
    slug: 'calm-and-reset-slow-breath-field',
    title: 'Slow Breath Field',
    mood: 'calm_and_reset',
    band: 'theta',
    audioAssetKey: 'curated-calm-and-reset-slow-breath-field',
    orderInMood: 0,
    orderInBand: 0,
  },
  {
    slug: 'calm-and-reset-slow-breath-field-2',
    title: 'Slow Breath Field II',
    mood: 'calm_and_reset',
    band: 'theta',
    audioAssetKey: 'curated-calm-and-reset-slow-breath-field-2',
    orderInMood: 1,
    orderInBand: 1,
  },
  {
    slug: 'calm-and-reset-slow-it-down',
    title: 'Slow It Down',
    mood: 'calm_and_reset',
    band: 'theta',
    audioAssetKey: 'curated-calm-and-reset-slow-it-down',
    orderInMood: 2,
    orderInBand: 2,
  },
  {
    slug: 'calm-and-reset-slow-it-down-2',
    title: 'Slow It Down II',
    mood: 'calm_and_reset',
    band: 'theta',
    audioAssetKey: 'curated-calm-and-reset-slow-it-down-2',
    orderInMood: 3,
    orderInBand: 3,
  },
  {
    slug: 'calm-and-reset-slow-it-down-3',
    title: 'Slow It Down III',
    mood: 'calm_and_reset',
    band: 'theta',
    audioAssetKey: 'curated-calm-and-reset-slow-it-down-3',
    orderInMood: 4,
    orderInBand: 4,
  },
  {
    slug: 'calm-and-reset-slow-it-down-4',
    title: 'Slow It Down IV',
    mood: 'calm_and_reset',
    band: 'theta',
    audioAssetKey: 'curated-calm-and-reset-slow-it-down-4',
    orderInMood: 5,
    orderInBand: 5,
  },

  // Focus & Flow — beta
  {
    slug: 'focus-and-flow-clear-mind-drift',
    title: 'Clear Mind Drift',
    mood: 'focus_and_flow',
    band: 'beta',
    audioAssetKey: 'curated-focus-and-flow-clear-mind-drift',
    orderInMood: 0,
    orderInBand: 0,
  },
  {
    slug: 'focus-and-flow-clear-mind-drift-2',
    title: 'Clear Mind Drift II',
    mood: 'focus_and_flow',
    band: 'beta',
    audioAssetKey: 'curated-focus-and-flow-clear-mind-drift-2',
    orderInMood: 1,
    orderInBand: 1,
  },
  {
    slug: 'focus-and-flow-clear-static',
    title: 'Clear Static',
    mood: 'focus_and_flow',
    band: 'beta',
    audioAssetKey: 'curated-focus-and-flow-clear-static',
    orderInMood: 2,
    orderInBand: 2,
  },
  {
    slug: 'focus-and-flow-clear-static-2',
    title: 'Clear Static II',
    mood: 'focus_and_flow',
    band: 'beta',
    audioAssetKey: 'curated-focus-and-flow-clear-static-2',
    orderInMood: 3,
    orderInBand: 3,
  },
  {
    slug: 'focus-and-flow-glasswater-halo',
    title: 'Glasswater Halo',
    mood: 'focus_and_flow',
    band: 'beta',
    audioAssetKey: 'curated-focus-and-flow-glasswater-halo',
    orderInMood: 4,
    orderInBand: 4,
  },
  {
    slug: 'focus-and-flow-glasswater-halo-2',
    title: 'Glasswater Halo II',
    mood: 'focus_and_flow',
    band: 'beta',
    audioAssetKey: 'curated-focus-and-flow-glasswater-halo-2',
    orderInMood: 5,
    orderInBand: 5,
  },

  // Gratitude & Joy — alpha
  {
    slug: 'gratitude-and-joy-back-in-my-body',
    title: 'Back In My Body',
    mood: 'gratitude_and_joy',
    band: 'alpha',
    audioAssetKey: 'curated-gratitude-and-joy-back-in-my-body',
    orderInMood: 0,
    orderInBand: 6,
  },
  {
    slug: 'gratitude-and-joy-back-in-my-body-2',
    title: 'Back In My Body II',
    mood: 'gratitude_and_joy',
    band: 'alpha',
    audioAssetKey: 'curated-gratitude-and-joy-back-in-my-body-2',
    orderInMood: 1,
    orderInBand: 7,
  },
  {
    slug: 'gratitude-and-joy-back-in-my-body-3',
    title: 'Back In My Body III',
    mood: 'gratitude_and_joy',
    band: 'alpha',
    audioAssetKey: 'curated-gratitude-and-joy-back-in-my-body-3',
    orderInMood: 2,
    orderInBand: 8,
  },
  {
    slug: 'gratitude-and-joy-back-in-my-body-4',
    title: 'Back In My Body IV',
    mood: 'gratitude_and_joy',
    band: 'alpha',
    audioAssetKey: 'curated-gratitude-and-joy-back-in-my-body-4',
    orderInMood: 3,
    orderInBand: 9,
  },
  {
    slug: 'gratitude-and-joy-return-the-weight',
    title: 'Return The Weight',
    mood: 'gratitude_and_joy',
    band: 'alpha',
    audioAssetKey: 'curated-gratitude-and-joy-return-the-weight',
    orderInMood: 4,
    orderInBand: 10,
  },
  {
    slug: 'gratitude-and-joy-return-the-weight-2',
    title: 'Return The Weight II',
    mood: 'gratitude_and_joy',
    band: 'alpha',
    audioAssetKey: 'curated-gratitude-and-joy-return-the-weight-2',
    orderInMood: 5,
    orderInBand: 11,
  },

  // Courage & Confidence — beta
  {
    slug: 'courage-and-confidence-face-the-thing',
    title: 'Face The Thing',
    mood: 'courage_and_confidence',
    band: 'beta',
    audioAssetKey: 'curated-courage-and-confidence-face-the-thing',
    orderInMood: 0,
    orderInBand: 6,
  },
  {
    slug: 'courage-and-confidence-face-the-thing-2',
    title: 'Face The Thing II',
    mood: 'courage_and_confidence',
    band: 'beta',
    audioAssetKey: 'curated-courage-and-confidence-face-the-thing-2',
    orderInMood: 1,
    orderInBand: 7,
  },
  {
    slug: 'courage-and-confidence-quiet-threshold',
    title: 'Quiet Threshold',
    mood: 'courage_and_confidence',
    band: 'beta',
    audioAssetKey: 'curated-courage-and-confidence-quiet-threshold',
    orderInMood: 2,
    orderInBand: 8,
  },
  {
    slug: 'courage-and-confidence-quiet-threshold-2',
    title: 'Quiet Threshold II',
    mood: 'courage_and_confidence',
    band: 'beta',
    audioAssetKey: 'curated-courage-and-confidence-quiet-threshold-2',
    orderInMood: 3,
    orderInBand: 9,
  },
  {
    slug: 'courage-and-confidence-shoulders-to-the-door',
    title: 'Shoulders To The Door',
    mood: 'courage_and_confidence',
    band: 'beta',
    audioAssetKey: 'curated-courage-and-confidence-shoulders-to-the-door',
    orderInMood: 4,
    orderInBand: 10,
  },
  {
    slug: 'courage-and-confidence-shoulders-to-the-door-2',
    title: 'Shoulders To The Door II',
    mood: 'courage_and_confidence',
    band: 'beta',
    audioAssetKey: 'curated-courage-and-confidence-shoulders-to-the-door-2',
    orderInMood: 5,
    orderInBand: 11,
  },

  // Uplift & Energy — gamma
  {
    slug: 'uplift-and-energy-reset-room',
    title: 'Reset Room',
    mood: 'uplift_and_energy',
    band: 'gamma',
    audioAssetKey: 'curated-uplift-and-energy-reset-room',
    orderInMood: 0,
    orderInBand: 0,
  },
  {
    slug: 'uplift-and-energy-reset-room-2',
    title: 'Reset Room II',
    mood: 'uplift_and_energy',
    band: 'gamma',
    audioAssetKey: 'curated-uplift-and-energy-reset-room-2',
    orderInMood: 1,
    orderInBand: 1,
  },
  {
    slug: 'uplift-and-energy-soft-reset-fields',
    title: 'Soft Reset Fields',
    mood: 'uplift_and_energy',
    band: 'gamma',
    audioAssetKey: 'curated-uplift-and-energy-soft-reset-fields',
    orderInMood: 2,
    orderInBand: 2,
  },
  {
    slug: 'uplift-and-energy-soft-reset-fields-2',
    title: 'Soft Reset Fields II',
    mood: 'uplift_and_energy',
    band: 'gamma',
    audioAssetKey: 'curated-uplift-and-energy-soft-reset-fields-2',
    orderInMood: 3,
    orderInBand: 3,
  },
  {
    slug: 'uplift-and-energy-tide-room',
    title: 'Tide Room',
    mood: 'uplift_and_energy',
    band: 'gamma',
    audioAssetKey: 'curated-uplift-and-energy-tide-room',
    orderInMood: 4,
    orderInBand: 4,
  },
  {
    slug: 'uplift-and-energy-tide-room-2',
    title: 'Tide Room II',
    mood: 'uplift_and_energy',
    band: 'gamma',
    audioAssetKey: 'curated-uplift-and-energy-tide-room-2',
    orderInMood: 5,
    orderInBand: 5,
  },

  // Travel Calm — alpha
  {
    slug: 'travel-calm-airport-grounder',
    title: 'Airport Grounder',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-airport-grounder',
    orderInMood: 0,
    orderInBand: 12,
  },
  {
    slug: 'travel-calm-airport-grounder-2',
    title: 'Airport Grounder II',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-airport-grounder-2',
    orderInMood: 1,
    orderInBand: 13,
  },
  {
    slug: 'travel-calm-boarding-breath',
    title: 'Boarding Breath',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-boarding-breath',
    orderInMood: 2,
    orderInBand: 14,
  },
  {
    slug: 'travel-calm-boarding-breath-2',
    title: 'Boarding Breath II',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-boarding-breath-2',
    orderInMood: 3,
    orderInBand: 15,
  },
  {
    slug: 'travel-calm-take-off-steady',
    title: 'Take Off Steady',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-take-off-steady',
    orderInMood: 4,
    orderInBand: 16,
  },
  {
    slug: 'travel-calm-take-off-steady-2',
    title: 'Take Off Steady II',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-take-off-steady-2',
    orderInMood: 5,
    orderInBand: 17,
  },
  {
    slug: 'travel-calm-mid-flight-calm',
    title: 'Mid Flight Calm',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-mid-flight-calm',
    orderInMood: 6,
    orderInBand: 18,
  },
  {
    slug: 'travel-calm-mid-flight-calm-2',
    title: 'Mid Flight Calm II',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-mid-flight-calm-2',
    orderInMood: 7,
    orderInBand: 19,
  },
  {
    slug: 'travel-calm-turbulence-softening',
    title: 'Turbulence Softening',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-turbulence-softening',
    orderInMood: 8,
    orderInBand: 20,
  },
  {
    slug: 'travel-calm-turbulence-softening-2',
    title: 'Turbulence Softening II',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-turbulence-softening-2',
    orderInMood: 9,
    orderInBand: 21,
  },
  {
    slug: 'travel-calm-landing-relief',
    title: 'Landing Relief',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-landing-relief',
    orderInMood: 10,
    orderInBand: 22,
  },
  {
    slug: 'travel-calm-landing-relief-2',
    title: 'Landing Relief II',
    mood: 'travel_calm',
    band: 'alpha',
    audioAssetKey: 'curated-travel-calm-landing-relief-2',
    orderInMood: 11,
    orderInBand: 23,
  },
];

export const CURATED_SOUNDSCAPES: SoundscapeTrack[] = RAW.map((r) => ({
  ...r,
  eyebrow: DEFAULT_EYEBROW,
}));

export const SOUNDSCAPE_BY_SLUG: Record<string, SoundscapeTrack> =
  CURATED_SOUNDSCAPES.reduce<Record<string, SoundscapeTrack>>((acc, track) => {
    acc[track.slug] = track;
    return acc;
  }, {});

export function soundscapesForMood(mood: SoundscapeMood): SoundscapeTrack[] {
  return CURATED_SOUNDSCAPES.filter((t) => t.mood === mood).sort(
    (a, b) => a.orderInMood - b.orderInMood,
  );
}

export function soundscapesForBand(band: SoundscapeBand): SoundscapeTrack[] {
  return CURATED_SOUNDSCAPES.filter((t) => t.band === band).sort(
    (a, b) => a.orderInBand - b.orderInBand,
  );
}
