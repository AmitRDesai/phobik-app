import type { Ionicons } from '@expo/vector-icons';
import type { AccentHue } from '@/constants/colors';
import type { EmotionalFamilyId } from './types';

type IoniconName = keyof typeof Ionicons.glyphMap;

export interface EmotionalFamily {
  id: EmotionalFamilyId;
  label: string;
  subFeelings: string[];
  icon: IoniconName;
  tone: AccentHue;
}

export const EMOTIONAL_FAMILIES: readonly EmotionalFamily[] = [
  {
    id: 'activated',
    label: 'Activated',
    subFeelings: ['Angry', 'Stressed', 'Anxious', 'Tense'],
    icon: 'flash',
    tone: 'pink',
  },
  {
    id: 'heavy',
    label: 'Heavy',
    subFeelings: ['Sad', 'Exhausted', 'Numb', 'Drained'],
    icon: 'cloud',
    tone: 'purple',
  },
  {
    id: 'mixed',
    label: 'Mixed',
    subFeelings: ['Confused', 'Uncertain', 'Overloaded', 'Chaotic'],
    icon: 'shuffle',
    tone: 'orange',
  },
  {
    id: 'grounded',
    label: 'Grounded',
    subFeelings: ['Calm', 'Relaxed', 'Present', 'Safe'],
    icon: 'leaf',
    tone: 'cyan',
  },
  {
    id: 'energized',
    label: 'Energized',
    subFeelings: ['Motivated', 'Focused', 'Strong', 'Inspired'],
    icon: 'sunny',
    tone: 'yellow',
  },
  {
    id: 'connected',
    label: 'Connected',
    subFeelings: ['Joyful', 'Grateful', 'Loved', 'Hopeful'],
    icon: 'heart',
    tone: 'pink',
  },
] as const;

export function getEmotionalFamily(
  id: EmotionalFamilyId,
): EmotionalFamily | undefined {
  return EMOTIONAL_FAMILIES.find((f) => f.id === id);
}
