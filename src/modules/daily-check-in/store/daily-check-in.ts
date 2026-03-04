import { atom } from 'jotai';
import type { StressorKey } from '../data/stressors';

// --- Energy Pillars (0-25 each) ---
export interface EnergyPillars {
  purpose: number;
  mental: number;
  physical: number;
  relationship: number;
}

const defaultEnergyPillars: EnergyPillars = {
  purpose: 12,
  mental: 12,
  physical: 12,
  relationship: 12,
};

export const energyPillarsAtom = atom<EnergyPillars>(defaultEnergyPillars);

export const energyIndexAtom = atom((get) => {
  const pillars = get(energyPillarsAtom);
  return (
    pillars.purpose + pillars.mental + pillars.physical + pillars.relationship
  );
});

// --- Stressor Ratings (1-10 each) ---
// Defaults spread across rings to match design:
// Inner (7-10): inner-critic, purpose, exhaustion
// Middle (4-6): work, self-image, isolation
// Outer (1-3): financial, relationships, time, fear
const defaultStressorRatings: Record<StressorKey, number> = {
  work: 5,
  financial: 2,
  relationships: 2,
  'self-image': 5,
  time: 3,
  'inner-critic': 8,
  isolation: 5,
  fear: 3,
  purpose: 8,
  exhaustion: 7,
};

export const stressorRatingsAtom = atom<Record<StressorKey, number>>(
  defaultStressorRatings,
);

// Top 3 stressors = lowest ratings (most drained)
export const topStressorsAtom = atom((get) => {
  const ratings = get(stressorRatingsAtom);
  return (Object.entries(ratings) as [StressorKey, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([key, rating]) => ({ key, rating }));
});

// --- Reset atom for flow exit ---
export const resetDailyCheckInAtom = atom(null, (_get, set) => {
  set(energyPillarsAtom, defaultEnergyPillars);
  set(stressorRatingsAtom, defaultStressorRatings);
});
