import type { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import type { AccentHue } from '@/constants/colors';
import { PILLAR_WEIGHTS, type PillarKey } from '../lib/scoring';

type IoniconName = keyof typeof Ionicons.glyphMap;
type RingGradient = 'pink-yellow' | 'yellow-pink' | 'gold-pink';

export interface PillarMeta {
  key: PillarKey;
  /** Short name — used in the My Rhythm grid + breakdown rows. */
  label: string;
  /** Full title shown at the top of the pillar detail screen. */
  title: string;
  /** Weight as a 0–1 fraction (also exposed as a % string for display). */
  weight: number;
  weightLabel: string;
  route: Href;
  icon: IoniconName;
  tone: AccentHue;
  gradient: RingGradient;
  /** One-line summary shown in the Scientific Breakdown rows. */
  summary: string;
  /** Long-form science copy for the pillar detail screen. */
  scienceTitle: string;
  science: string;
}

export const PILLARS: Record<PillarKey, PillarMeta> = {
  recovery: {
    key: 'recovery',
    label: 'Recovery',
    title: 'Rest & Recovery',
    weight: PILLAR_WEIGHTS.recovery,
    weightLabel: '30% Weight',
    route: '/rhythm/recovery',
    icon: 'moon',
    tone: 'gold',
    gradient: 'gold-pink',
    summary: 'Sleep duration, quality, and consistency.',
    scienceTitle: 'Science of Stillness',
    science:
      'Research consistently shows sleep is one of the strongest predictors of cognitive performance, emotional regulation, and recovery.',
  },
  regulation: {
    key: 'regulation',
    label: 'Regulation',
    title: 'Nervous System Regulation',
    weight: PILLAR_WEIGHTS.regulation,
    weightLabel: '30% Weight',
    route: '/rhythm/regulation',
    icon: 'pulse',
    tone: 'pink',
    gradient: 'pink-yellow',
    summary: 'Heart Rate Variability (HRV) and Stress Check-in.',
    scienceTitle: 'The Science of Flexibility',
    science:
      'HRV is one of the best available proxies for autonomic flexibility and resilience. It measures the variation in time between each heartbeat, controlled by a primitive part of the nervous system.',
  },
  movement: {
    key: 'movement',
    label: 'Movement',
    title: 'Movement',
    weight: PILLAR_WEIGHTS.movement,
    weightLabel: '20% Weight',
    route: '/rhythm/movement',
    icon: 'walk',
    tone: 'orange',
    gradient: 'yellow-pink',
    summary: 'Steps and daily physical capacity.',
    scienceTitle: 'The Power of Motion',
    science:
      'Research shows regular movement improves mood, cognitive function, and stress resilience. Every step is an investment in your neural health.',
  },
  resilience: {
    key: 'resilience',
    label: 'Resilience',
    title: 'Emotional Resilience',
    weight: PILLAR_WEIGHTS.resilience,
    weightLabel: '20% Weight',
    route: '/rhythm/resilience',
    icon: 'shield-checkmark',
    tone: 'yellow',
    gradient: 'gold-pink',
    summary: 'Self-efficacy and perceived capability.',
    scienceTitle: 'The Efficacy Anchor',
    science:
      'This measures self-efficacy, which predicts resilience better than mood. By identifying your internal resources today, you anchor your emotional state in competence rather than fleeting feelings.',
  },
};

/** Pillars in canonical display order. */
export const PILLAR_LIST: PillarMeta[] = [
  PILLARS.recovery,
  PILLARS.regulation,
  PILLARS.movement,
  PILLARS.resilience,
];

/** Score → one-line interpretation shown under each pillar's ring. */
export const PILLAR_STATUS_LINES: Record<
  PillarKey,
  (score: number | null) => string
> = {
  recovery: (score) => {
    if (score == null) return 'Connect a wearable to track your recovery.';
    if (score >= 70)
      return "Your body is effectively integrating yesterday's strain.";
    if (score >= 45)
      return 'You are partially recovered. Prioritize rest today.';
    return 'Your body needs deep rest. Be gentle with yourself.';
  },
  regulation: (score) => {
    if (score == null)
      return 'Complete a Daily Flow to measure your regulation.';
    if (score >= 70) return 'Your nervous system is well regulated today.';
    if (score >= 45)
      return 'Your nervous system is moderately activated today.';
    return 'Your nervous system is highly activated. Be gentle with yourself.';
  },
  movement: (score) => {
    if (score == null) return 'Connect a wearable to track your movement.';
    if (score >= 70)
      return 'You are more active than your weekly average. Keep the momentum.';
    if (score >= 45)
      return 'A steady day of movement. A short walk can lift it further.';
    return 'Movement is low today. Even a few minutes helps your nervous system.';
  },
  resilience: (score) => {
    if (score == null) return 'Check in below to anchor your resilience today.';
    if (score >= 75) return 'Your ability to bounce back is strong right now.';
    if (score >= 50) return 'Your ability to bounce back is steady.';
    return 'Be patient with yourself — resilience rebuilds with small wins.';
  },
};

/** Resilience self-efficacy check-in answer scale (index 0–4). */
export const RESILIENCE_OPTIONS = [
  'Not at all',
  'A little',
  'Moderately',
  'Very',
  'Extremely',
] as const;
