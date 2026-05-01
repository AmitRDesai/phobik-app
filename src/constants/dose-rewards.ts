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
  | 'meditation'
  | 'meditation-loving-kindness';

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
  meditation: { dopamine: 5, oxytocin: 0, serotonin: 5, endorphins: 5 },
  'meditation-loving-kindness': {
    dopamine: 5,
    oxytocin: 5,
    serotonin: 5,
    endorphins: 5,
  },
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
