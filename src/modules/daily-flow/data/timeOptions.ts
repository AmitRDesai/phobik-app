import type { Ionicons } from '@expo/vector-icons';
import type { TimeOptionId } from './types';

type IoniconName = keyof typeof Ionicons.glyphMap;

export interface TimeOption {
  id: TimeOptionId;
  label: string;
  description: string;
  icon: IoniconName;
  stepCount: number;
}

export const TIME_OPTIONS: readonly TimeOption[] = [
  {
    id: 'quick_reset',
    label: 'Quick Reset',
    description: '3–5 min',
    icon: 'flash-outline',
    stepCount: 3,
  },
  {
    id: 'short_flow',
    label: 'Short Flow',
    description: '5–10 min',
    icon: 'leaf-outline',
    stepCount: 4,
  },
  {
    id: 'balanced_flow',
    label: 'Balanced Flow',
    description: '10–20 min',
    icon: 'water-outline',
    stepCount: 5,
  },
  {
    id: 'deep_flow',
    label: 'Deep Flow',
    description: '20–30 min',
    icon: 'planet-outline',
    stepCount: 6,
  },
  {
    id: 'full_reset',
    label: 'Full Reset',
    description: '30+ min',
    icon: 'sparkles-outline',
    stepCount: 7,
  },
] as const;

export function getTimeOption(id: TimeOptionId): TimeOption | undefined {
  return TIME_OPTIONS.find((t) => t.id === id);
}
