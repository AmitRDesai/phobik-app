import type { ImageSourcePropType } from 'react-native';

import feelingOverwhelmed from '@/assets/images/daily-flow/feeling-overwhelmed.png';
import feelingLow from '@/assets/images/daily-flow/feeling-low.png';
import feelingAnxious from '@/assets/images/daily-flow/feeling-anxious.png';
import feelingDrained from '@/assets/images/daily-flow/feeling-drained.png';
import feelingDisconnected from '@/assets/images/daily-flow/feeling-disconnected.png';
import mindfulOverwhelmed from '@/assets/images/daily-flow/mindful-overwhelmed.png';
import mindfulLow from '@/assets/images/daily-flow/mindful-low.png';
import mindfulAnxious from '@/assets/images/daily-flow/mindful-anxious.png';
import mindfulDrained from '@/assets/images/daily-flow/mindful-drained.png';
import mindfulDisconnected from '@/assets/images/daily-flow/mindful-disconnected.png';

import type { FeelingId, TappingFeelingId } from './types';

export type AccentToken = 'primary' | 'secondary' | 'tertiary';

export type FeelingActionItem = {
  icon: string;
  label: string;
  labelItalic?: string;
  title?: string;
  description?: string;
  accent?: AccentToken;
  fullWidth?: boolean;
};

export type VisualAnchor = {
  label: string;
  title: string;
  image: ImageSourcePropType;
};

export type VisualFocus = {
  image: ImageSourcePropType;
  caption: string;
};

export type VisualCloud = {
  image: ImageSourcePropType;
};

export type VisualEthereal = {
  image: ImageSourcePropType;
  icon: string;
  quote: string;
};

export type MindfulCardContent = {
  quote: string;
  image: ImageSourcePropType;
};

export type FeelingContent = {
  id: FeelingId;
  label: string;
  needsLabel: string;
  ctaLabel: string;
  accentToken: AccentToken;
  icon: string;
  image: ImageSourcePropType;
  description: string;
  tappingFeelingId: TappingFeelingId;

  detailTitle: string;
  detailSubtitle: string;
  subtitleColor: AccentToken;
  subtitleItalic: boolean;
  showCategoryLabel?: boolean;
  actionItemStyle: 'compact' | 'bento' | 'bento-tall';
  emphasisStyle?: 'split-muted' | 'continuous-bold' | 'plain';
  insightLabel?: string;
  actionsLabel?: string;
  descriptionLead: string;
  descriptionEmphasis: string;
  actionItems: FeelingActionItem[];
  visualAnchor?: VisualAnchor;
  visualFocus?: VisualFocus;
  visualCloud?: VisualCloud;
  visualEthereal?: VisualEthereal;
  mindfulCard?: MindfulCardContent;
  ctaSubtitle?: string;
};

const FEELING_IMAGES = {
  overwhelmed: feelingOverwhelmed,
  low: feelingLow,
  anxious: feelingAnxious,
  drained: feelingDrained,
  disconnected: feelingDisconnected,
} as const;

const MINDFUL_IMAGES = {
  overwhelmed: mindfulOverwhelmed,
  low: mindfulLow,
  anxious: mindfulAnxious,
  drained: mindfulDrained,
  disconnected: mindfulDisconnected,
} as const;

export const FEELINGS: FeelingContent[] = [
  {
    id: 'overwhelmed',
    label: 'Overstimulated',
    needsLabel: 'needs structure',
    ctaLabel: 'Enter Flow',
    accentToken: 'primary',
    icon: 'spa',
    image: FEELING_IMAGES.overwhelmed,
    description:
      'Quiet the noise and find your center in a world of constant motion.',
    tappingFeelingId: 'overstimulated',

    detailTitle: 'Overwhelmed',
    detailSubtitle: 'Needs structure',
    subtitleColor: 'secondary',
    subtitleItalic: true,
    actionItemStyle: 'compact',
    descriptionLead: 'Your mind is juggling too many open loops. ',
    descriptionEmphasis: "More effort isn't the answer.",
    actionItems: [
      { icon: 'adjust', label: 'Focus on one task' },
      { icon: 'arrow-right-alt', label: 'Take one next step' },
      { icon: 'do-not-disturb-on', label: 'Reduce input and distractions' },
    ],
    mindfulCard: {
      quote:
        'Your capacity is finite. Respect your boundaries to regain your power.',
      image: MINDFUL_IMAGES.overwhelmed,
    },
  },
  {
    id: 'low',
    label: 'Sad',
    needsLabel: 'needs support',
    ctaLabel: 'Connect Now',
    accentToken: 'secondary',
    icon: 'filter-hdr',
    image: FEELING_IMAGES.low,
    description:
      "When you're sad, nothing is broken. Your nervous system needs support. It doesn't need to be fixed or rushed, but we need to allow it to feel.",
    tappingFeelingId: 'unsteady',

    detailTitle: 'Sad',
    detailSubtitle: 'Needs support',
    subtitleColor: 'primary',
    subtitleItalic: false,
    actionItemStyle: 'bento',
    descriptionLead: 'Nothing is broken. ',
    descriptionEmphasis: 'Your system may be looking for connection.',
    actionItems: [
      {
        icon: 'hub',
        label: 'Reach out to someone you trust',
        title: 'Reach out to someone you trust',
        description: 'Shared burdens are lighter.',
        accent: 'secondary',
      },
      {
        icon: 'favorite',
        label: 'Be gentle with yourself',
        title: 'Be gentle with yourself',
        description: 'Kindness is your best medicine.',
        accent: 'primary',
      },
      {
        icon: 'hourglass-empty',
        label: 'Allow the feeling without rushing it',
        title: 'Allow the feeling without rushing it',
        description: 'This is a temporary state, not a permanent home.',
        accent: 'tertiary',
        fullWidth: true,
      },
    ],
    visualAnchor: {
      label: 'Visual Anchor',
      title: 'Grounding Warmth',
      image: MINDFUL_IMAGES.low,
    },
  },
  {
    id: 'anxious',
    label: 'Anxious',
    needsLabel: 'needs safety',
    ctaLabel: 'Invite Presence',
    accentToken: 'secondary',
    icon: 'electric-bolt',
    image: FEELING_IMAGES.anxious,
    description:
      'When your mind is racing, your system is looking for a sense of safety and calm.',
    tappingFeelingId: 'triggered',

    detailTitle: 'Anxious',
    detailSubtitle: 'Needs a sense of safety',
    subtitleColor: 'primary',
    subtitleItalic: false,
    showCategoryLabel: false,
    actionItemStyle: 'compact',
    emphasisStyle: 'continuous-bold',
    insightLabel: 'The Insight',
    actionsLabel: 'Helpful actions',
    descriptionLead: 'Your mind is scanning for potential threats. ',
    descriptionEmphasis: "More thinking doesn't solve it.",
    actionItems: [
      { icon: 'air', label: 'Slow your breathing' },
      {
        icon: 'center-focus-strong',
        label: 'Bring your attention to the present',
      },
      {
        icon: 'favorite',
        label: 'Remind yourself:',
        labelItalic: "'I'm okay right now'",
      },
    ],
    visualFocus: {
      image: MINDFUL_IMAGES.anxious,
      caption: 'Safety is found in the body, not the narrative.',
    },
    ctaSubtitle: 'Take as much time as you need.',
  },
  {
    id: 'drained',
    label: 'Emotional Fatigue',
    needsLabel: 'needs space',
    ctaLabel: 'Open Heart',
    accentToken: 'primary',
    icon: 'favorite',
    image: FEELING_IMAGES.drained,
    description:
      'When your energy is low, your system needs space to pause and reset.',
    tappingFeelingId: 'drained',

    detailTitle: 'Emotionally Drained',
    detailSubtitle: 'Needs space',
    subtitleColor: 'primary',
    subtitleItalic: false,
    showCategoryLabel: false,
    actionItemStyle: 'bento-tall',
    emphasisStyle: 'plain',
    descriptionLead:
      'Your system is overloaded and needs less, not more. Pushing through can make it worse.',
    descriptionEmphasis: '',
    actionItems: [
      {
        icon: 'pause-circle',
        label: 'Step back and pause',
        accent: 'secondary',
      },
      { icon: 'blur-off', label: 'Reduce stimulation', accent: 'primary' },
      {
        icon: 'restore',
        label: 'Give yourself time to reset',
        accent: 'tertiary',
      },
    ],
    visualCloud: {
      image: MINDFUL_IMAGES.drained,
    },
  },
  {
    id: 'disconnected',
    label: 'Disconnected',
    needsLabel: 'needs sensation',
    ctaLabel: 'Reconnect',
    accentToken: 'tertiary',
    icon: 'leak-add',
    image: FEELING_IMAGES.disconnected,
    description:
      'When you feel distant or numb, your body needs sensation to bring you back into the present.',
    tappingFeelingId: 'disconnected',

    detailTitle: 'Disconnected',
    detailSubtitle: 'Needs sensation',
    subtitleColor: 'secondary',
    subtitleItalic: true,
    actionItemStyle: 'bento',
    descriptionLead: 'Your body may be pulling back to protect you. ',
    descriptionEmphasis: "Thinking your way out won't reconnect you.",
    actionItems: [
      {
        icon: 'directions-run',
        label: 'Move your body',
        title: 'Move your body',
        description:
          'Gentle stretching or a fast-paced walk to trigger sensory feedback.',
        accent: 'tertiary',
      },
      {
        icon: 'water-drop',
        label: 'Use temperature',
        title: 'Use temperature',
        description:
          'Splash cool water on your face or hold an ice cube to snap back to now.',
        accent: 'secondary',
      },
      {
        icon: 'waves',
        label: 'Engage your senses',
        title: 'Engage your senses',
        description:
          'Find 5 things you can see, 4 you can touch, and 3 you can hear.',
        accent: 'primary',
      },
    ],
    visualEthereal: {
      image: MINDFUL_IMAGES.disconnected,
      icon: 'favorite',
      quote: 'I am here. I am safe. I am in my body.',
    },
  },
];

export function getFeeling(id: FeelingId): FeelingContent | undefined {
  return FEELINGS.find((f) => f.id === id);
}
