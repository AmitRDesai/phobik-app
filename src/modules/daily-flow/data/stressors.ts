import type { Ionicons } from '@expo/vector-icons';
import type { AccentHue } from '@/constants/colors';
import type { StressorId } from './types';

type IoniconName = keyof typeof Ionicons.glyphMap;

export interface Stressor {
  id: StressorId;
  label: string;
  icon: IoniconName;
  tone: AccentHue;
}

export const STRESSORS: readonly Stressor[] = [
  { id: 'work', label: 'Work', icon: 'briefcase-outline', tone: 'cyan' },
  { id: 'money', label: 'Money', icon: 'cash-outline', tone: 'yellow' },
  {
    id: 'relationships',
    label: 'Relationships',
    icon: 'heart-outline',
    tone: 'pink',
  },
  {
    id: 'self_image',
    label: 'Self-Image',
    icon: 'person-outline',
    tone: 'purple',
  },
  { id: 'time', label: 'Time', icon: 'time-outline', tone: 'orange' },
  {
    id: 'connection',
    label: 'Connection',
    icon: 'globe-outline',
    tone: 'gold',
  },
  {
    id: 'uncertainty',
    label: 'Uncertainty',
    icon: 'help-outline',
    tone: 'purple',
  },
  { id: 'purpose', label: 'Purpose', icon: 'compass-outline', tone: 'yellow' },
  {
    id: 'burnout',
    label: 'Burnout',
    icon: 'battery-dead-outline',
    tone: 'pink',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'git-branch-outline',
    tone: 'cyan',
  },
] as const;
