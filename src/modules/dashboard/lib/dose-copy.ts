import type { Chemical } from '@/constants/dose-chemicals';
import type { Href } from 'expo-router';

export type { Chemical };

export type ChemicalMeta = {
  /** Pillar label paired with this chemical in the EnergyDetails design. */
  pillar: 'BODY' | 'MIND' | 'EMOTION' | 'CONNECTION';
  /** Display name used as eyebrow on cards. */
  label: string;
  /** Tagline shown on the lowest-signal insight line. */
  insight: string;
  /** Scientific Insight body — "why this matters" copy. */
  scientificInsight: string;
  /** Boost CTA verbatim — used for the Next Best Boost card. */
  boostLabel: string;
  /** "Do it now" target route for the lowest chemical. */
  boostRoute: Href;
};

export const CHEMICAL_META: Record<Chemical, ChemicalMeta> = {
  dopamine: {
    pillar: 'MIND',
    label: 'Dopamine',
    insight: 'Mind is your lowest signal today',
    scientificInsight:
      'Low dopamine flattens motivation. One small completed task delivers a real progress signal — start with a 2-minute micro challenge.',
    boostLabel: 'Complete one micro challenge to spark progress.',
    boostRoute: '/practices/micro-challenges',
  },
  oxytocin: {
    pillar: 'CONNECTION',
    label: 'Oxytocin',
    insight: 'Connection is your lowest signal today',
    scientificInsight:
      'Low oxytocin correlates with high cortisol. A 20-second hug or a kind message can reset your baseline energy score.',
    boostLabel: 'Send a message to someone you trust.',
    boostRoute: '/community',
  },
  serotonin: {
    pillar: 'EMOTION',
    label: 'Serotonin',
    insight: 'Emotion is your lowest signal today',
    scientificInsight:
      'Steadiness comes from rhythm. A 3-minute check-in or step outside resets the mood-regulation loop.',
    boostLabel: 'Take a quick self check-in.',
    boostRoute: '/practices/self-check-ins',
  },
  endorphins: {
    pillar: 'BODY',
    label: 'Endorphins',
    insight: 'Body is your lowest signal today',
    scientificInsight:
      'Endorphins release through movement and breath. Even 60 seconds of breathwork shifts your stress chemistry.',
    boostLabel: 'Try a quick reset breathwork.',
    boostRoute: '/morning-reset',
  },
};

export type DoseLevel = 'low' | 'partial' | 'balanced' | 'full';

export type DoseLevelMeta = {
  id: DoseLevel;
  label: string;
  message: string;
};

export const DOSE_LEVELS: DoseLevelMeta[] = [
  {
    id: 'low',
    label: 'Low Dose',
    message: 'Your system may need gentle support today.',
  },
  {
    id: 'partial',
    label: 'Partial Dose',
    message: 'You gave your brain a few helpful signals.',
  },
  {
    id: 'balanced',
    label: 'Balanced Dose',
    message: 'You supported your mood and momentum today.',
  },
  {
    id: 'full',
    label: 'Full Dose',
    message: 'You gave your nervous system a powerful reset.',
  },
];

export function levelForScore(total: number): DoseLevelMeta {
  if (total >= 76) return DOSE_LEVELS[3]!;
  if (total >= 51) return DOSE_LEVELS[2]!;
  if (total >= 26) return DOSE_LEVELS[1]!;
  return DOSE_LEVELS[0]!;
}
