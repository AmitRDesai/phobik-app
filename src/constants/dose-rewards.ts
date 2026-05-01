/**
 * Central D.O.S.E. reward configuration per practice type.
 * Update values here — all practice completions and displays read from this config.
 */

export type DoseReward = {
  dopamine: number;
  oxytocin: number;
  serotonin: number;
  endorphins: number;
};

export type PracticeType =
  | 'box-breathing'
  | '478-breathing'
  | 'star-breathing'
  | 'double-inhale'
  | 'lazy8-breathing'
  | 'grounding'
  | 'muscle-relaxation'
  | 'sleep-meditation'
  // meditation
  | 'yoga-nidra'
  | 'breath-reset'
  | 'body-scan'
  | 'befriending-your-fear'
  | 'letting-go'
  | 'loving-kindness'
  | 'present-moment-reset'
  | 'future-visualization';

// Default rewards for guided meditations (3-chemical: dopamine, serotonin,
// endorphins). Loving Kindness adds oxytocin for the connection/bonding angle.
const MEDITATION_DEFAULT: DoseReward = {
  dopamine: 5,
  oxytocin: 0,
  serotonin: 5,
  endorphins: 5,
};

export const DOSE_REWARDS: Record<PracticeType, DoseReward> = {
  'box-breathing': { dopamine: 0, oxytocin: 0, serotonin: 5, endorphins: 10 },
  '478-breathing': { dopamine: 0, oxytocin: 0, serotonin: 5, endorphins: 10 },
  'star-breathing': { dopamine: 0, oxytocin: 0, serotonin: 5, endorphins: 10 },
  'double-inhale': { dopamine: 0, oxytocin: 0, serotonin: 5, endorphins: 10 },
  'lazy8-breathing': { dopamine: 0, oxytocin: 0, serotonin: 5, endorphins: 10 },
  grounding: { dopamine: 0, oxytocin: 5, serotonin: 10, endorphins: 0 },
  'muscle-relaxation': {
    dopamine: 0,
    oxytocin: 10,
    serotonin: 5,
    endorphins: 5,
  },
  'sleep-meditation': {
    dopamine: 0,
    oxytocin: 5,
    serotonin: 10,
    endorphins: 0,
  },
  // meditation
  'yoga-nidra': MEDITATION_DEFAULT,
  'breath-reset': MEDITATION_DEFAULT,
  'body-scan': MEDITATION_DEFAULT,
  'befriending-your-fear': MEDITATION_DEFAULT,
  'letting-go': MEDITATION_DEFAULT,
  'loving-kindness': { dopamine: 5, oxytocin: 5, serotonin: 5, endorphins: 5 },
  'present-moment-reset': MEDITATION_DEFAULT,
  'future-visualization': MEDITATION_DEFAULT,
};

/** Get active D.O.S.E. rewards (non-zero values) for display */
export function getActiveDoseRewards(type: PracticeType) {
  const rewards = DOSE_REWARDS[type];
  return Object.entries(rewards)
    .filter(([, value]) => value > 0)
    .map(([chemical, value]) => ({
      chemical: chemical as keyof DoseReward,
      value,
      label: chemical.charAt(0).toUpperCase() + chemical.slice(1),
    }));
}
