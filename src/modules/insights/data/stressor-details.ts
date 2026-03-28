import { colors } from '@/constants/colors';
import type { StressorKey } from '@/modules/daily-check-in/data/stressors';

export interface StressorDetailData {
  key: StressorKey;
  headerTitle: string;
  headerSubtitle: string;
  emoji: string;
  title: string;
  description: string;
  stressImpact: string;
  avgDuration: string;
  reflectQuestion: string;
  stressSigns: string[];
  selectedStrengths: string[];
  exercises: StressorExercise[];
}

export interface StressorExercise {
  icon: string;
  iconColor?: string;
  title: string;
  description: string;
  supports: string;
  buttonLabel: string;
  highlighted?: boolean;
}

const STRENGTHS = [
  'Connect',
  'Creativity',
  'Curiosity',
  'Compassion',
  'Courage',
  'Calm',
  'Clarity',
  'Confidence',
];

export { STRENGTHS };

export const STRESSOR_DETAILS: Record<StressorKey, StressorDetailData> = {
  work: {
    key: 'work',
    headerTitle: 'Work Pressure',
    headerSubtitle: 'Stressor Detail',
    emoji: '💼',
    title: 'Achievement Pressure',
    description:
      'Triggers cortisol and adrenaline surges through perceived threat to achievement or identity.',
    stressImpact: 'High',
    avgDuration: '4.2 hrs',
    reflectQuestion:
      '"Do I feel like I\'m always racing to prove my worth or stay ahead?"',
    stressSigns: [
      'Tight jaw',
      'Racing mind',
      'Sunday dread',
      'Difficulty unplugging',
    ],
    selectedStrengths: ['Clarity', 'Confidence'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Get a personalized micro challenge.',
        supports: 'Courage & Action',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'air',
        title: 'Double Inhale',
        description: 'Physiological Sigh to reset',
        supports: 'Calm & Clarity',
        buttonLabel: 'Start',
      },
      {
        icon: 'grid-view',
        iconColor: colors.accent.gold,
        title: 'Box Breathing',
        description: 'For mental focus',
        supports: 'Focus & Calm',
        buttonLabel: 'Start',
      },
      {
        icon: 'accessibility-new',
        iconColor: '#fff',
        title: 'Muscle Relaxation',
        description: 'Release jaw and shoulder tension',
        supports: 'Physical Ease',
        buttonLabel: 'Start',
      },
    ],
  },
  exhaustion: {
    key: 'exhaustion',
    headerTitle: 'Vitality Analysis',
    headerSubtitle: 'Stressor Detail',
    emoji: '💤',
    title: 'Exhaustion',
    description:
      'Chronic hyperarousal without recovery impairs memory and immune health.',
    stressImpact: 'Severe',
    avgDuration: '7.2 hrs',
    reflectQuestion: '"Am I giving my body and mind real downtime?"',
    stressSigns: ['Insomnia', 'Irritability', 'Burnout'],
    selectedStrengths: ['Compassion', 'Calm'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Personalized micro challenge',
        supports: 'Resilience & Agency',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'nights-stay',
        title: 'Evening Wind-Down',
        description: 'Prepare your mind for rest',
        supports: 'Recovery',
        buttonLabel: 'Start',
      },
      {
        icon: 'self-improvement',
        iconColor: colors.accent.gold,
        title: 'Sleep Meditation',
        description: 'Deep delta-wave guidance',
        supports: 'Deep Rest',
        buttonLabel: 'Start',
      },
      {
        icon: 'accessibility-new',
        iconColor: '#fff',
        title: 'Muscle Relaxation (PMR)',
        description: 'Release physical stress points',
        supports: 'Physical Tension',
        buttonLabel: 'Start',
      },
    ],
  },
  'self-image': {
    key: 'self-image',
    headerTitle: 'Self-Image Leader',
    headerSubtitle: 'Stressor Detail',
    emoji: '🪞',
    title: 'Self-Image',
    description:
      "The brain's reward network becomes hijacked by comparison and external validation loops.",
    stressImpact: 'Constant',
    avgDuration: '5.1 hrs',
    reflectQuestion: '"Do I judge myself harshly or feel behind others?"',
    stressSigns: ['Shame spirals', 'Social media fatigue', 'Perfectionism'],
    selectedStrengths: ['Compassion', 'Curiosity'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Personalized micro challenge',
        supports: 'Agency',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'visibility',
        title: 'Mirror Exercise',
        description: 'Self-acceptance practice',
        supports: 'Self-Worth',
        buttonLabel: 'Start',
      },
      {
        icon: 'favorite',
        iconColor: colors.accent.gold,
        title: 'Self-Compassion',
        description: 'Reflection guided session',
        supports: 'Inner Peace',
        buttonLabel: 'Start',
      },
      {
        icon: 'edit-note',
        iconColor: '#fff',
        title: 'Journaling',
        description: 'Process thoughts freely',
        supports: 'Perspective',
        buttonLabel: 'Start',
      },
    ],
  },
  isolation: {
    key: 'isolation',
    headerTitle: 'Connection Analysis',
    headerSubtitle: 'Stressor Detail',
    emoji: '🧍',
    title: 'Isolation',
    description:
      'Social isolation increases inflammation and lowers vagal tone.',
    stressImpact: 'Deep',
    avgDuration: 'All-Day',
    reflectQuestion: '"Do I feel supported or alone in my struggles?"',
    stressSigns: [
      'Disconnection',
      'Emotional numbing',
      'Scrolling instead of connecting',
    ],
    selectedStrengths: ['Connect', 'Courage'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Get a personalized micro challenge to build resilience.',
        supports: 'Confidence',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'group',
        title: 'Reach Out Challenge',
        description: 'Message one person today',
        supports: 'Social Bridge',
        buttonLabel: 'Start',
      },
      {
        icon: 'forum',
        iconColor: colors.accent.gold,
        title: 'Courage Wall',
        description: 'Interact with the community',
        supports: 'Visibility',
        buttonLabel: 'Interact',
      },
      {
        icon: 'favorite',
        iconColor: '#fff',
        title: 'Loving Kindness',
        description: 'Compassion-based meditation',
        supports: 'Self-Compassion',
        buttonLabel: 'Start',
      },
    ],
  },
  relationships: {
    key: 'relationships',
    headerTitle: 'Relationships Leader',
    headerSubtitle: 'Stressor Detail',
    emoji: '💔',
    title: 'Social Connection',
    description:
      'Social disconnection suppresses oxytocin and heightens threat detection.',
    stressImpact: 'High',
    avgDuration: '2.8 hrs',
    reflectQuestion:
      '"Do I feel emotionally safe expressing myself around others?"',
    stressSigns: [
      'Over-apologizing',
      'People-pleasing',
      'Withdrawal',
      'Explosive reactions',
    ],
    selectedStrengths: ['Connect', 'Compassion'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Get a personalized micro challenge to build resilience.',
        supports: 'Courage & Confidence',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'groups',
        title: 'Co-Regulation Game',
        description: 'Sync breath with a partner',
        supports: 'Connection & Calm',
        buttonLabel: 'Start',
      },
      {
        icon: 'send',
        iconColor: colors.accent.gold,
        title: 'Appreciation Text',
        description: 'Reach out with gratitude',
        supports: 'Connection',
        buttonLabel: 'Start',
      },
      {
        icon: 'favorite',
        iconColor: '#fff',
        title: 'Loving Kindness',
        description: 'Compassion meditation practice',
        supports: 'Compassion',
        buttonLabel: 'Start',
      },
    ],
  },
  fear: {
    key: 'fear',
    headerTitle: 'Resilience Analysis',
    headerSubtitle: 'Stressor Detail',
    emoji: '💢',
    title: 'Unresolved Fear',
    description:
      "Fear loops form when the amygdala doesn't get new evidence that it's safe.",
    stressImpact: 'Sharp',
    avgDuration: '1.5 hrs',
    reflectQuestion:
      '"What situations or thoughts do I keep avoiding out of fear?"',
    stressSigns: ['Avoidance', 'Procrastination', 'Catastrophizing'],
    selectedStrengths: ['Courage', 'Curiosity'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Personalized micro challenge',
        supports: 'Micro-Action',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'shield',
        title: 'Micro Exposure Game',
        description: 'Safe, gamified confrontation',
        supports: 'Desensitization',
        buttonLabel: 'Play',
      },
      {
        icon: 'air',
        iconColor: colors.accent.gold,
        title: '4-7-8 Breathing',
        description: 'Calm the nervous system',
        supports: 'Resilience',
        buttonLabel: 'Start',
      },
      {
        icon: 'edit-note',
        iconColor: '#fff',
        title: 'Courage Journal',
        description: 'Track your courage wins',
        supports: 'Confidence',
        buttonLabel: 'Write',
      },
    ],
  },
  'inner-critic': {
    key: 'inner-critic',
    headerTitle: 'Inner Critic Leader',
    headerSubtitle: 'Stressor Detail',
    emoji: '💬',
    title: 'Inner Critic',
    description:
      'Self-judgment activates the same neural pain circuits as physical harm.',
    stressImpact: 'Persistent',
    avgDuration: '4.8 hrs',
    reflectQuestion:
      '"How often does my inner dialogue sound like a bully instead of a coach?"',
    stressSigns: ['Rumination', 'Paralysis', 'Low Confidence'],
    selectedStrengths: ['Compassion', 'Clarity'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Get a personalized micro challenge to build resilience.',
        supports: 'Resilience',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'edit-note',
        title: 'Self-Compassion Letter',
        description: 'Rewrite your internal dialogue',
        supports: 'Empathy',
        buttonLabel: 'Start',
      },
      {
        icon: 'spa',
        iconColor: colors.accent.gold,
        title: '5-4-3-2-1 Grounding',
        description: 'Return to the present moment',
        supports: 'Calm',
        buttonLabel: 'Start',
      },
      {
        icon: 'lightbulb',
        iconColor: '#fff',
        title: 'Positive Affirmation',
        description: 'Strengthen your sense of self',
        supports: 'Confidence',
        buttonLabel: 'Start',
      },
    ],
  },
  purpose: {
    key: 'purpose',
    headerTitle: 'Purpose Leader',
    headerSubtitle: 'Stressor Detail',
    emoji: '🧭',
    title: 'Lack of Purpose',
    description:
      'Dopamine circuits depend on having meaningful goals and perceived progress.',
    stressImpact: 'Chronic',
    avgDuration: 'Indefinite',
    reflectQuestion:
      '"Do I feel energized by something bigger than my to-do list?"',
    stressSigns: ['Apathy', 'Numbness', 'Loss of motivation'],
    selectedStrengths: ['Creativity', 'Clarity'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Get a personalized micro challenge',
        supports: 'Meaning',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'edit-note',
        title: 'Value-Based Journaling',
        description: 'Realign with core values',
        supports: 'Alignment',
        buttonLabel: 'Start',
      },
      {
        icon: 'flag',
        iconColor: colors.accent.gold,
        title: 'Intent Setting',
        description: 'Define daily micro-aims',
        supports: 'Momentum',
        buttonLabel: 'Start',
      },
      {
        icon: 'remove-red-eye',
        iconColor: '#fff',
        title: 'Visualization',
        description: 'Construct your future clear',
        supports: 'Future Self',
        buttonLabel: 'Start',
      },
    ],
  },
  time: {
    key: 'time',
    headerTitle: 'Capacity Analysis',
    headerSubtitle: 'Time Scarcity Leader',
    emoji: '🕰',
    title: 'Time Scarcity',
    description:
      'Perceived lack of time increases sympathetic activation and impulsivity.',
    stressImpact: 'Intermittent',
    avgDuration: '6.2 hrs',
    reflectQuestion:
      '"Do I often feel there\'s never enough time to catch my breath?"',
    stressSigns: ['Over-scheduling', 'Multitasking', 'Irritability'],
    selectedStrengths: ['Calm', 'Clarity'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Get a personalized micro challenge',
        supports: 'Focus',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'grid-view',
        title: 'Box Breathing',
        description: '4-4-4-4 technique for focus',
        supports: 'Calm',
        buttonLabel: 'Start',
      },
      {
        icon: 'checklist',
        iconColor: colors.accent.gold,
        title: 'Priority Log',
        description: 'What actually matters today?',
        supports: 'Clarity',
        buttonLabel: 'Start',
      },
      {
        icon: 'spa',
        iconColor: '#fff',
        title: 'Mindful Reset',
        description: '1-minute grounding session',
        supports: 'Presence',
        buttonLabel: 'Start',
      },
    ],
  },
  financial: {
    key: 'financial',
    headerTitle: 'Financial Leader',
    headerSubtitle: 'Stressor Detail',
    emoji: '💰',
    title: 'Financial Security',
    description:
      "Chronic uncertainty activates the amygdala's fear circuits tied to survival.",
    stressImpact: 'Moderate',
    avgDuration: '3.5 hrs',
    reflectQuestion: '"Do money concerns dominate my mental space or sleep?"',
    stressSigns: ['Catastrophic thinking', 'Tight chest', 'Scarcity mindset'],
    selectedStrengths: ['Courage', 'Calm'],
    exercises: [
      {
        icon: 'auto-awesome',
        title: 'AI Courage Coach',
        description: 'Get a personalized micro challenge',
        supports: 'Micro-Action',
        buttonLabel: 'Get Challenge',
        highlighted: true,
      },
      {
        icon: 'air',
        title: 'Grounding Breath',
        description: '4-7-8 technique for calm',
        supports: 'Regulation',
        buttonLabel: 'Start',
      },
      {
        icon: 'edit-note',
        iconColor: colors.accent.gold,
        title: 'Control Journal',
        description: '"What is within my control?"',
        supports: 'Perspective',
        buttonLabel: 'Start',
      },
      {
        icon: 'spa',
        iconColor: '#fff',
        title: '5-4-3-2-1 Grounding',
        description: 'Safety visualization exercise',
        supports: 'Grounding',
        buttonLabel: 'Start',
      },
    ],
  },
};
