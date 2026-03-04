export type StressorKey =
  | 'work'
  | 'financial'
  | 'relationships'
  | 'self-image'
  | 'time'
  | 'inner-critic'
  | 'isolation'
  | 'fear'
  | 'purpose'
  | 'exhaustion';

export interface StressorCategory {
  key: StressorKey;
  label: string;
  icon: string; // MaterialIcons name
  emoji: string;
  biologicalRoot: string;
  practice: {
    name: string;
    icon: string;
    description: string;
  };
}

export const STRESSOR_CATEGORIES: StressorCategory[] = [
  {
    key: 'work',
    label: 'Work & Performance',
    icon: 'trending-up',
    emoji: '💼',
    biologicalRoot:
      'Chronic performance pressure elevates cortisol and depletes prefrontal resources.',
    practice: {
      name: 'Focus Reset',
      icon: 'center-focus-strong',
      description:
        'Take 3 deep breaths and write down your single most important task for the next hour.',
    },
  },
  {
    key: 'financial',
    label: 'Financial Security',
    icon: 'account-balance-wallet',
    emoji: '💰',
    biologicalRoot:
      'Chronic uncertainty activates the amygdala fear circuits tied to survival.',
    practice: {
      name: 'Grounding Breath',
      icon: 'self-improvement',
      description:
        'Journal on "What is within my control today?" and visualize safety with 4-7-8 method.',
    },
  },
  {
    key: 'relationships',
    label: 'Relationships & Conflict',
    icon: 'diversity-3',
    emoji: '💔',
    biologicalRoot:
      'Social disconnection suppresses oxytocin and heightens threat detection.',
    practice: {
      name: 'Co-Regulation',
      icon: 'groups',
      description:
        "Co-Regulation Game — match your breath to a loved one's pace for 2 minutes.",
    },
  },
  {
    key: 'self-image',
    label: 'Self Image and Comparison',
    icon: 'person-search',
    emoji: '🪞',
    biologicalRoot:
      'Social comparison activates default mode network rumination and self-criticism loops.',
    practice: {
      name: 'Mirror Work',
      icon: 'visibility',
      description:
        'Stand before a mirror and speak 3 things you appreciate about yourself today.',
    },
  },
  {
    key: 'time',
    label: 'Time Scarcity',
    icon: 'timer-off',
    emoji: '🕰',
    biologicalRoot:
      'Perceived lack of time increases sympathetic activation and impulsivity.',
    practice: {
      name: 'Chronos Command',
      icon: 'schedule',
      description:
        'Box Breathing (4-4-4-4) + journal "What can wait until tomorrow?"',
    },
  },
  {
    key: 'inner-critic',
    label: 'Inner Critic',
    icon: 'psychology',
    emoji: '💬',
    biologicalRoot:
      'Inner critic patterns activate the anterior cingulate cortex error detection system.',
    practice: {
      name: 'Compassion Reset',
      icon: 'favorite',
      description:
        'Write the critical thought down, then rewrite it as advice from a caring friend.',
    },
  },
  {
    key: 'isolation',
    label: 'Isolation and Loneliness',
    icon: 'group-off',
    emoji: '🧍',
    biologicalRoot:
      'Loneliness triggers inflammatory responses similar to physical pain pathways.',
    practice: {
      name: 'Connection Spark',
      icon: 'connect-without-contact',
      description:
        'Send a genuine message to someone you care about. Small connections rewire safety.',
    },
  },
  {
    key: 'fear',
    label: 'Unresolved Fear',
    icon: 'warning',
    emoji: '💢',
    biologicalRoot:
      'Unprocessed fear keeps the amygdala in hypervigilance mode, draining cognitive resources.',
    practice: {
      name: 'Fear Mapping',
      icon: 'map',
      description:
        'Name the fear specifically. Write "The worst that could happen is..." then "I would handle it by..."',
    },
  },
  {
    key: 'purpose',
    label: 'Lack of Purpose',
    icon: 'explore',
    emoji: '🧍‍♀️',
    biologicalRoot:
      'Purposelessness reduces dopaminergic drive and motivation circuitry activation.',
    practice: {
      name: 'Purpose Pulse',
      icon: 'lightbulb',
      description:
        'Write 3 moments this week where you felt alive or useful. Find the thread.',
    },
  },
  {
    key: 'exhaustion',
    label: 'Exhaustion and Recovery',
    icon: 'battery-1-bar',
    emoji: '💤',
    biologicalRoot:
      'Chronic exhaustion dysregulates the HPA axis and impairs emotional regulation.',
    practice: {
      name: 'Recovery Protocol',
      icon: 'bedtime',
      description:
        'Progressive muscle relaxation (5 min) followed by "What can I let go of today?"',
    },
  },
];
