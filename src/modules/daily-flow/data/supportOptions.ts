import type { ImageSourcePropType } from 'react-native';

import neuralBloomImage from '@/assets/images/daily-flow/support-neural-bloom.png';
import vibrationalSaltImage from '@/assets/images/daily-flow/support-vibrational-salt.png';
import amberGlowImage from '@/assets/images/daily-flow/support-amber-glow.png';

import type { AccentToken } from './feelings';
import type { SupportOptionId } from './types';

export type SupportOption = {
  id: SupportOptionId;
  title: string;
  description: string;
  duration: string;
  durationColor: AccentToken;
  bestMatch?: boolean;
  image: ImageSourcePropType;
};

export const SUPPORT_OPTIONS: SupportOption[] = [
  {
    id: 'neural_bloom',
    title: 'Neural Bloom',
    description:
      'Isochronic tones to dissolve digital fatigue and reset focus.',
    duration: '12 min',
    durationColor: 'primary',
    bestMatch: true,
    image: neuralBloomImage,
  },
  {
    id: 'vibrational_salt',
    title: 'Vibrational Salt',
    description:
      'Deep aquatic resonance for grounding after high-stress meetings.',
    duration: '18 min',
    durationColor: 'tertiary',
    image: vibrationalSaltImage,
  },
  {
    id: 'amber_glow',
    title: 'Amber Glow',
    description: 'Warm white noise layered with gentle morning bird acoustics.',
    duration: '10 min',
    durationColor: 'secondary',
    image: amberGlowImage,
  },
];

export function getSupportOption(
  id: SupportOptionId,
): SupportOption | undefined {
  return SUPPORT_OPTIONS.find((o) => o.id === id);
}
