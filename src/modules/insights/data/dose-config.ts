import {
  CHEMICAL_COLORS,
  CHEMICAL_ICONS,
  type Chemical,
} from '@/constants/dose-chemicals';
import type { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { DoseTotals } from '../hooks/useDailyDose';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface DoseChemical {
  key: Chemical;
  label: string;
  subtitle: string;
  icon: IconName;
  color: string;
  coins: number;
  maxCoins: number;
}

/** Display config for each chemical — labels + insights-specific subtitle + max target.
 * Color and icon come from the canonical `@/constants/dose-chemicals` map so the
 * same chemical reads identically on dashboard and insights surfaces. */
const DOSE_DISPLAY: Omit<DoseChemical, 'coins'>[] = [
  {
    key: 'dopamine',
    label: 'Dopamine',
    subtitle: 'Progress & Momentum',
    icon: CHEMICAL_ICONS.dopamine,
    color: CHEMICAL_COLORS.dopamine,
    maxCoins: 25,
  },
  {
    key: 'oxytocin',
    label: 'Oxytocin',
    subtitle: 'Connection & Safety',
    icon: CHEMICAL_ICONS.oxytocin,
    color: CHEMICAL_COLORS.oxytocin,
    maxCoins: 25,
  },
  {
    key: 'serotonin',
    label: 'Serotonin',
    subtitle: 'Confidence & Stability',
    icon: CHEMICAL_ICONS.serotonin,
    color: CHEMICAL_COLORS.serotonin,
    maxCoins: 25,
  },
  {
    key: 'endorphins',
    label: 'Endorphins',
    subtitle: 'Stress Relief & Resilience',
    icon: CHEMICAL_ICONS.endorphins,
    color: CHEMICAL_COLORS.endorphins,
    maxCoins: 25,
  },
];

/** Merge real D.O.S.E. totals with display config */
export function buildDoseChemicals(totals: DoseTotals): DoseChemical[] {
  return DOSE_DISPLAY.map((display) => ({
    ...display,
    coins: totals[display.key],
  }));
}

/** Get display config for a specific chemical */
export function getChemicalDisplay(key: keyof DoseTotals) {
  return DOSE_DISPLAY.find((c) => c.key === key)!;
}

/** Find the lowest chemical from totals */
export function getLowestChemical(totals: DoseTotals): keyof DoseTotals {
  let lowest: keyof DoseTotals = 'dopamine';
  let lowestValue = totals.dopamine;

  for (const key of ['oxytocin', 'serotonin', 'endorphins'] as const) {
    if (totals[key] < lowestValue) {
      lowest = key;
      lowestValue = totals[key];
    }
  }

  return lowest;
}

/** Smart tips for each chemical deficiency */
const DEFICIENCY_TIPS: Record<keyof DoseTotals, string> = {
  dopamine: 'Try a micro challenge or mystery exercise to boost your momentum.',
  oxytocin: 'Try a 60-second connection reset with a loved one or pet.',
  serotonin: 'A short grounding or gratitude exercise can lift your serotonin.',
  endorphins: 'A quick breathing exercise or movement session will help.',
};

export function getDeficiencyTip(chemical: keyof DoseTotals): string {
  return DEFICIENCY_TIPS[chemical];
}
