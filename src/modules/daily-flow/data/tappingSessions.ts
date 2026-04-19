import type { ImageSourcePropType } from 'react-native';

import MEDITATION_IMAGE from '@/assets/images/daily-flow/tapping-figure-hires.png';

import type { TappingFeelingId } from './types';

export type TappingSessionContent = {
  id: TappingFeelingId;
  title: string;
  setupPhrase: string;
  prompt: string;
  accent: 'pink' | 'yellow';
  image: ImageSourcePropType;
};

export const TAPPING_SESSIONS: Record<TappingFeelingId, TappingSessionContent> =
  {
    overstimulated: {
      id: 'overstimulated',
      title: 'Overstimulated',
      setupPhrase:
        "Even though everything feels like too much, I'm open to creating calm inside me.",
      prompt: 'This is a lot right now.',
      accent: 'yellow',
      image: MEDITATION_IMAGE,
    },
    drained: {
      id: 'drained',
      title: 'Drained',
      setupPhrase:
        "Even though I feel drained, I'm open to restoring my energy.",
      prompt: 'I feel really tired.',
      accent: 'pink',
      image: MEDITATION_IMAGE,
    },
    disconnected: {
      id: 'disconnected',
      title: 'Disconnected',
      setupPhrase:
        "Even though I feel distant or shut down, I'm open to gently reconnecting with myself.",
      prompt: 'I feel a bit disconnected.',
      accent: 'pink',
      image: MEDITATION_IMAGE,
    },
    triggered: {
      id: 'triggered',
      title: 'Triggered',
      setupPhrase:
        "Even though I feel triggered right now, I'm open to staying grounded in myself.",
      prompt: 'This reaction feels strong.',
      accent: 'pink',
      image: MEDITATION_IMAGE,
    },
    unsteady: {
      id: 'unsteady',
      title: 'Unsteady',
      setupPhrase:
        "Even though I feel off or unsettled, I'm open to finding steadiness again.",
      prompt: 'I feel all over the place.',
      accent: 'pink',
      image: MEDITATION_IMAGE,
    },
  };

export function getTappingSession(id: TappingFeelingId): TappingSessionContent {
  return TAPPING_SESSIONS[id];
}
