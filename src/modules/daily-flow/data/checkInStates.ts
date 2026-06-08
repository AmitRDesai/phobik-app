import checkinAnxious from '@/assets/images/daily-flow/checkin-anxious.png';
import checkinCalm from '@/assets/images/daily-flow/checkin-calm.png';
import checkinLowEnergy from '@/assets/images/daily-flow/checkin-low-energy.png';
import checkinTiredWired from '@/assets/images/daily-flow/checkin-tired-wired.jpg';
import type { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import type { AccentHue } from '@/constants/colors';
import type { CheckInState } from './types';

type IoniconName = keyof typeof Ionicons.glyphMap;

export interface CheckInOption {
  id: CheckInState;
  label: string;
  helper: string;
  icon: IoniconName;
  tone: AccentHue;
  image: ImageSourcePropType;
}

export const CHECK_IN_OPTIONS: readonly CheckInOption[] = [
  {
    id: 'low_energy',
    label: 'Low Energy',
    helper: 'Help me recharge',
    icon: 'battery-half-outline',
    tone: 'purple',
    image: checkinLowEnergy,
  },
  {
    id: 'anxious',
    label: 'Anxious',
    helper: 'Help me release stress',
    icon: 'flash-outline',
    tone: 'pink',
    image: checkinAnxious,
  },
  {
    id: 'tired_but_wired',
    label: 'Tired but Wired',
    helper: 'Help me find focus',
    icon: 'pulse-outline',
    tone: 'orange',
    image: checkinTiredWired,
  },
  {
    id: 'calm',
    label: 'Calm',
    helper: 'Help me maintain balance',
    icon: 'leaf-outline',
    tone: 'cyan',
    image: checkinCalm,
  },
] as const;
