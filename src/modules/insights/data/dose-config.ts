import type { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface DoseChemical {
  key: 'dopamine' | 'oxytocin' | 'serotonin' | 'endorphins';
  label: string;
  subtitle: string;
  icon: IconName;
  color: string;
  coins: number;
  maxCoins: number;
}

export const DOSE_CHEMICALS: DoseChemical[] = [
  {
    key: 'dopamine',
    label: 'Dopamine',
    subtitle: 'Progress & Momentum',
    icon: 'bolt',
    color: '#FFD700',
    coins: 18,
    maxCoins: 25,
  },
  {
    key: 'oxytocin',
    label: 'Oxytocin',
    subtitle: 'Connection & Safety',
    icon: 'favorite',
    color: '#00D4FF',
    coins: 9,
    maxCoins: 25,
  },
  {
    key: 'serotonin',
    label: 'Serotonin',
    subtitle: 'Confidence & Stability',
    icon: 'eco',
    color: '#00FF94',
    coins: 22,
    maxCoins: 25,
  },
  {
    key: 'endorphins',
    label: 'Endorphins',
    subtitle: 'Stress Relief & Resilience',
    icon: 'fitness-center',
    color: '#FF2D85',
    coins: 14,
    maxCoins: 25,
  },
];

export interface DoseActivity {
  chemical: DoseChemical['key'];
  activity: string;
  coins: number;
}

export const DOSE_ACTIVITIES: DoseActivity[] = [
  { chemical: 'dopamine', activity: 'Micro Challenge', coins: 5 },
  { chemical: 'serotonin', activity: 'Gratitude Log', coins: 8 },
  { chemical: 'endorphins', activity: 'Quick Workout', coins: 10 },
  { chemical: 'oxytocin', activity: 'Community Chat', coins: 3 },
];

export function getChemicalByKey(key: DoseChemical['key']) {
  return DOSE_CHEMICALS.find((c) => c.key === key)!;
}
