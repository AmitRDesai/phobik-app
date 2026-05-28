import type { Ionicons } from '@expo/vector-icons';
import type { AccentHue } from '@/constants/colors';
import type { SensationCategoryId } from './types';

type IoniconName = keyof typeof Ionicons.glyphMap;

export interface SensationCategory {
  id: SensationCategoryId;
  label: string;
  icon: IoniconName;
  tone: AccentHue;
  chips: string[];
}

export const SENSATION_CATEGORIES: readonly SensationCategory[] = [
  {
    id: 'tension',
    label: 'Tension',
    icon: 'fitness',
    tone: 'pink',
    chips: ['Tight', 'Pressure', 'Clenched', 'Heavy'],
  },
  {
    id: 'activation',
    label: 'Activation',
    icon: 'flash',
    tone: 'yellow',
    chips: ['Buzzing', 'Tingling', 'Restless', 'Racing'],
  },
  {
    id: 'calm',
    label: 'Calm',
    icon: 'leaf',
    tone: 'cyan',
    chips: ['Soft', 'Open', 'Warm', 'Grounded'],
  },
  {
    id: 'movement',
    label: 'Movement',
    icon: 'reorder-three',
    tone: 'orange',
    chips: ['Fluttering', 'Pulsing', 'Flowing', 'Expanding'],
  },
  {
    id: 'low_energy',
    label: 'Low Energy',
    icon: 'moon',
    tone: 'purple',
    chips: ['Numb', 'Flat', 'Sluggish', 'Empty'],
  },
] as const;

export function getSensationCategory(
  id: SensationCategoryId,
): SensationCategory | undefined {
  return SENSATION_CATEGORIES.find((c) => c.id === id);
}
