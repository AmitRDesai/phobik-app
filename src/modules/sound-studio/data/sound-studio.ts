import nowPlayingImg from '@/assets/images/sound-studio/now-playing.jpg';
import moodFallbackBody from '@/assets/images/sound-studio/curated-body.jpg';
import moodFallbackConnection from '@/assets/images/sound-studio/curated-connection.jpg';
import moodFallbackEmotion from '@/assets/images/sound-studio/curated-emotion.jpg';
import moodFallbackMind from '@/assets/images/sound-studio/curated-mind.jpg';
import bandAlpha from '@/assets/images/sound-studio/curated/bands/band-alpha.jpg';
import bandBeta from '@/assets/images/sound-studio/curated/bands/band-beta.jpg';
import bandDelta from '@/assets/images/sound-studio/curated/bands/band-delta.jpg';
import bandGamma from '@/assets/images/sound-studio/curated/bands/band-gamma.jpg';
import bandTheta from '@/assets/images/sound-studio/curated/bands/band-theta.jpg';
import moodCalmAndReset from '@/assets/images/sound-studio/curated/moods/mood-calm-and-reset.jpg';
import moodCourageAndConfidence from '@/assets/images/sound-studio/curated/moods/mood-courage-and-confidence.jpg';
import moodFocusAndFlow from '@/assets/images/sound-studio/curated/moods/mood-focus-and-flow.jpg';
import moodGratitudeAndJoy from '@/assets/images/sound-studio/curated/moods/mood-gratitude-and-joy.jpg';
import moodHealingAndReflection from '@/assets/images/sound-studio/curated/moods/mood-healing-and-reflection.jpg';
import moodSleepAndRestore from '@/assets/images/sound-studio/curated/moods/mood-sleep-and-restore.jpg';
import moodTravelCalm from '@/assets/images/sound-studio/curated/moods/mood-travel-calm.jpg';
import moodUpliftAndEnergy from '@/assets/images/sound-studio/curated/moods/mood-uplift-and-energy.jpg';
import { colors, type AccentHue } from '@/constants/colors';
import type { MaterialIcons } from '@expo/vector-icons';

export type SoundscapeMood =
  | 'calm_and_reset'
  | 'courage_and_confidence'
  | 'focus_and_flow'
  | 'gratitude_and_joy'
  | 'healing_and_reflection'
  | 'sleep_and_restore'
  | 'travel_calm'
  | 'uplift_and_energy';

export type SoundscapeBand = 'alpha' | 'beta' | 'theta' | 'delta' | 'gamma';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

export type MoodMeta = {
  id: SoundscapeMood;
  /** Kebab-case slug used in route segments (`/sound-studio/curated/mood/[slug]`). */
  slug: string;
  label: string;
  headline: string;
  description: string;
  accentHue: AccentHue;
  icon: MaterialIconName;
  /** Per-mood gradient — two-stop hex pair, drawn diagonally on tiles. */
  gradient: [string, string];
  /**
   * Sub-menu hero artwork (mood's own detail screen). Optional while the
   * AI-generated set is being produced. When absent, screens fall back to
   * the gradient-only treatment.
   */
  fallbackImage?: number;
};

export const MOODS: MoodMeta[] = [
  {
    id: 'sleep_and_restore',
    slug: 'sleep-and-restore',
    label: 'Sleep & Restore',
    headline: 'Sleep & Restore',
    description:
      'Liminal drifts and moonroom textures to guide you into deep, restorative slumber.',
    accentHue: 'purple',
    icon: 'dark-mode',
    gradient: [colors.accent.purple, colors.chakra.indigo],
    fallbackImage: moodSleepAndRestore,
  },
  {
    id: 'healing_and_reflection',
    slug: 'healing-and-reflection',
    label: 'Healing & Reflection',
    headline: 'Healing & Reflection',
    description:
      'Safe-harbor fields and held rooms — quiet space for tender healing and reflection.',
    accentHue: 'cyan',
    icon: 'water-drop',
    gradient: [colors.accent.cyan, colors.chakra.indigo],
    fallbackImage: moodHealingAndReflection,
  },
  {
    id: 'calm_and_reset',
    slug: 'calm-and-reset',
    label: 'Calm & Reset',
    headline: 'Calm & Reset',
    description:
      'Slow-breath fields and gentle pulses to lower the baseline and bring your focus inward.',
    accentHue: 'purple',
    icon: 'spa',
    gradient: [colors.chakra.violet, colors.primary['pink-dark']],
    fallbackImage: moodCalmAndReset,
  },
  {
    id: 'focus_and_flow',
    slug: 'focus-and-flow',
    label: 'Focus & Flow',
    headline: 'Focus & Flow',
    description:
      'Glasswater clarity for the long stretch — pure focus without the noise.',
    accentHue: 'cyan',
    icon: 'center-focus-strong',
    gradient: [colors.accent.cyan, colors.chakra.blue],
    fallbackImage: moodFocusAndFlow,
  },
  {
    id: 'gratitude_and_joy',
    slug: 'gratitude-and-joy',
    label: 'Gratitude & Joy',
    headline: 'Gratitude & Joy',
    description:
      'Body-warm tracks for gratitude and felt-sense joy. Come home to what matters.',
    accentHue: 'pink',
    icon: 'favorite',
    gradient: [colors.primary.pink, colors.accent.yellow],
    fallbackImage: moodGratitudeAndJoy,
  },
  {
    id: 'courage_and_confidence',
    slug: 'courage-and-confidence',
    label: 'Courage & Confidence',
    headline: 'Courage & Confidence',
    description:
      'Steady ground for hard moments — confidence to cross the threshold.',
    accentHue: 'yellow',
    icon: 'visibility',
    gradient: [colors.accent.yellow, colors.accent.orange],
    fallbackImage: moodCourageAndConfidence,
  },
  {
    id: 'uplift_and_energy',
    slug: 'uplift-and-energy',
    label: 'Uplift & Energy',
    headline: 'Uplift & Energy',
    description: 'Tide-room reset and field tracks — uplift without the crash.',
    accentHue: 'orange',
    icon: 'bolt',
    gradient: [colors.accent.orange, colors.chakra.red],
    fallbackImage: moodUpliftAndEnergy,
  },
  {
    id: 'travel_calm',
    slug: 'travel-calm',
    label: 'Travel Calm',
    headline: 'Travel Calm',
    description:
      'Immersive soundscapes designed to anchor your spirit during transitions. From terminal bustle to sky-high solitude.',
    accentHue: 'cyan',
    icon: 'flight',
    gradient: [colors.chakra.blue, colors.chakra.green],
    fallbackImage: moodTravelCalm,
  },
];

export const MOOD_BY_ID: Record<SoundscapeMood, MoodMeta> = MOODS.reduce(
  (acc, mood) => {
    acc[mood.id] = mood;
    return acc;
  },
  {} as Record<SoundscapeMood, MoodMeta>,
);

export const MOOD_BY_SLUG: Record<string, MoodMeta> = MOODS.reduce(
  (acc, mood) => {
    acc[mood.slug] = mood;
    return acc;
  },
  {} as Record<string, MoodMeta>,
);

export type FrequencyBandMeta = {
  id: SoundscapeBand;
  label: string;
  hzRange: string;
  headline: string;
  /** Two-line description shown under the headline. */
  description: string;
  bestFor: string[];
  /** Subtle scientific framing for the body of the band-detail screen. */
  body: string;
  accentHue: AccentHue;
  icon: MaterialIconName;
  /** Per-band gradient — matched to the mood-tile treatment for visual coherence. */
  gradient: [string, string];
  fallbackImage: number;
};

export const FREQUENCY_BANDS: FrequencyBandMeta[] = [
  {
    id: 'delta',
    label: 'Delta',
    hzRange: '0.5 – 4 Hz',
    headline: 'Deep Sleep',
    description:
      'The slowest brainwaves. Delta is your body’s nightly repair shift — deepest restoration, hormonal balance, nervous-system reset.',
    bestFor: [
      'Sleep tracks',
      'Yoga-nidra endings',
      'Overnight soundscapes',
      'Stress recovery',
    ],
    body: 'Delta dominates during dreamless sleep. In this band the brain coordinates growth-hormone release and lowers cortisol — a slow, embodied recalibration.',
    accentHue: 'pink',
    icon: 'dark-mode',
    gradient: [colors.primary.pink, colors.chakra.indigo],
    fallbackImage: bandDelta,
  },
  {
    id: 'theta',
    label: 'Theta',
    hzRange: '4 – 8 Hz',
    headline: 'Deep Relaxation',
    description:
      'The twilight state. Theta unlocks deep meditation, emotional processing, and the threshold between waking and sleep.',
    bestFor: ['Yogic naps', 'Body scans', 'Visualization', 'Deep calm'],
    body: 'Theta sits between waking and sleep. It opens a window for emotional release and imaginative integration — a slowing without disappearing.',
    accentHue: 'purple',
    icon: 'water-drop',
    gradient: [colors.chakra.violet, colors.chakra.indigo],
    fallbackImage: bandTheta,
  },
  {
    id: 'alpha',
    label: 'Alpha',
    hzRange: '8 – 12 Hz',
    headline: 'Calm & Grounded',
    description:
      'Phobik’s most important brainwave. Alpha is relaxed awareness — flow, presence, and the felt sense of being settled in the moment.',
    bestFor: ['Anxiety relief', 'Grounding', 'Fear of flying', 'EFT tapping'],
    body: 'Alpha shows up when attention softens but stays clear. It supports nervous-system regulation without dulling presence — the band Phobik leans on most.',
    accentHue: 'cyan',
    icon: 'waves',
    gradient: [colors.accent.cyan, colors.chakra.blue],
    fallbackImage: bandAlpha,
  },
  {
    id: 'beta',
    label: 'Beta',
    hzRange: '12 – 30 Hz',
    headline: 'Focus & Clarity',
    description:
      'Active, alert thinking. Low-beta supports concentration without tipping into stress — clear, engaged, present.',
    bestFor: ['Focus work', 'Studying', 'ADHD-friendly sessions', 'Reset'],
    body: 'Beta is the wakeful working state. Phobik favors the lower end (≈ 12–16 Hz) so attention stays sharp without recruiting the stress response.',
    accentHue: 'gold',
    icon: 'lightbulb',
    gradient: [colors.accent.gold, colors.accent.orange],
    fallbackImage: bandBeta,
  },
  {
    id: 'gamma',
    label: 'Gamma',
    hzRange: '30 – 100 Hz',
    headline: 'Insight & Awareness',
    description:
      'Peak cognitive integration. Gamma is associated with learning, advanced meditation, and the spark of insight.',
    bestFor: [
      'Insight practice',
      'Learning sessions',
      'Advanced meditation',
      'Transitions',
    ],
    body: 'Gamma rises during moments of integration. Used subtly — the dose matters, since high intensity for long sessions can overstimulate.',
    accentHue: 'orange',
    icon: 'bolt',
    gradient: [colors.accent.orange, colors.chakra.red],
    fallbackImage: bandGamma,
  },
];

export const BAND_BY_ID: Record<SoundscapeBand, FrequencyBandMeta> =
  FREQUENCY_BANDS.reduce(
    (acc, band) => {
      acc[band.id] = band;
      return acc;
    },
    {} as Record<SoundscapeBand, FrequencyBandMeta>,
  );

export type EmotionalTag =
  | 'Ethereal'
  | 'Vibrant'
  | 'Melancholy'
  | 'Aggressive'
  | 'Nostalgic'
  | 'Cinematic'
  | 'Hypnotic'
  | 'Euphoric'
  | 'Industrial'
  | 'Dreamy';

export const EMOTIONAL_TAGS: EmotionalTag[] = [
  'Ethereal',
  'Vibrant',
  'Melancholy',
  'Aggressive',
  'Nostalgic',
  'Cinematic',
  'Hypnotic',
  'Euphoric',
  'Industrial',
  'Dreamy',
];

export type CreditPlan = {
  id: string;
  name: string;
  credits: number;
  price: string;
  popular?: boolean;
  tagline?: string;
};

// Fallback display only — the server (credits.getConfig) is the source of
// truth and must stay in sync (backend CREDIT_PRODUCTS). At 5 credits/song
// these are 10 / 30 / 100 songs.
export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 50,
    price: '$4.99',
    tagline: '10 songs to explore your sound.',
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 150,
    price: '$11.99',
    popular: true,
    tagline: '30 songs. Best value for regular creators.',
  },
  {
    id: 'studio',
    name: 'Studio Pack',
    credits: 500,
    price: '$29.99',
    tagline: '100 songs for serious sound design.',
  },
];

export const NOW_PLAYING_IMAGE = nowPlayingImg;
