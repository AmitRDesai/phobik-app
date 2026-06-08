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
    description: '5 min',
    icon: 'flash-outline',
    stepCount: 3,
  },
  {
    id: 'short_flow',
    label: 'Short Flow',
    description: '15-30 min',
    icon: 'leaf-outline',
    stepCount: 5,
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
