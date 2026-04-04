import { atom } from 'jotai';

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

// --- Reset atom for flow exit ---
export const resetDailyCheckInAtom = atom(null, (_get, set) => {
  set(energyPillarsAtom, defaultEnergyPillars);
});
