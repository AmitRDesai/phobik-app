import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export type MysteryType =
  | 'breathing'
  | 'gratitude'
  | 'affirmations'
  | 'feelings'
  | 'needs'
  | 'wants';

export interface DoseReward {
  dopamine: number;
  oxytocin: number;
  serotonin: number;
  endorphins: number;
}

export interface MysteryChallenge {
  type: MysteryType;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  practiceLabel: string;
  practiceText: string;
  highlightText?: string;
  dose: DoseReward;
  wheelGradient: [string, string];
  wheelLabel: string;
  wheelSubtext: string;
}

export const MYSTERY_CHALLENGES: MysteryChallenge[] = [
  {
    type: 'breathing',
    title: 'BREATHING',
    description:
      '\u201CBreathing techniques help reduce anxiety by calming the nervous system, slowing the heart rate, and bringing your focus back to the present moment.\u201D',
    icon: 'air',
    practiceLabel: 'Today\u2019s Practice',
    practiceText:
      'Paced Breathing: Complete 1 minute of Paced Breathing (4s in, 6s out) to reset your internal rhythm.',
    highlightText: '1 minute',
    dose: { dopamine: 0, oxytocin: 0, serotonin: 5, endorphins: 10 },
    wheelGradient: [colors.gradient.amber, colors.accent.yellow],
    wheelLabel: 'Breathing',
    wheelSubtext: 'spend a minute focusing on your breath',
  },
  {
    type: 'gratitude',
    title: 'GRATITUDE',
    description:
      '\u201CPracticing gratitude daily shifts your focus from fear to appreciation, rewiring your brain to notice what\u2019s good, which boosts emotional resilience and reduces stress.\u201D',
    icon: 'favorite-border',
    practiceLabel: 'Today\u2019s Practice',
    practiceText:
      'Identify 3 small things that went well today, no matter how tiny, and acknowledge how they made you feel.',
    highlightText: '3 small things',
    dose: { dopamine: 10, oxytocin: 0, serotonin: 5, endorphins: 0 },
    wheelGradient: [colors.primary['pink-soft'], colors.primary['pink-dark']],
    wheelLabel: 'Gratitude',
    wheelSubtext: 'write down what you are grateful for',
  },
  {
    type: 'affirmations',
    title: 'AFFIRMATIONS',
    description:
      '\u201CWhen you repeat positive statements daily, your brain starts to believe them \u2014 thanks to its natural ability to adapt called neuroplasticity. Over time, this shifts your mindset, boosts self-esteem and helps calm stress and anxiety.\u201D',
    icon: 'chat-bubble-outline',
    practiceLabel: 'Today\u2019s Practice',
    practiceText:
      'Say out loud 3 times:\n\u201CI am capable of leading myself through this day with calm and clarity.\u201D',
    dose: { dopamine: 10, oxytocin: 0, serotonin: 5, endorphins: 0 },
    wheelGradient: [colors.primary.pink, colors.gradient['hot-pink']],
    wheelLabel: 'Affirmations',
    wheelSubtext: 'take time to say positive affirmations',
  },
  {
    type: 'feelings',
    title: 'FEELINGS',
    description:
      'Identifying your emotions is the first step to calming anxiety because it helps you understand what you are feeling, why it\u2019s happening, and how to respond with clarity rather than fear.',
    icon: 'visibility',
    practiceLabel: 'Today\u2019s Practice',
    practiceText: 'Pause right now and name your current emotion.',
    highlightText: 'Where do you feel it in your body?',
    dose: { dopamine: 0, oxytocin: 5, serotonin: 10, endorphins: 0 },
    wheelGradient: [colors.primary['pink-light'], colors.primary['pink-soft']],
    wheelLabel: 'Feelings',
    wheelSubtext: 'ask yourself how you are feeling',
  },
  {
    type: 'needs',
    title: 'NEEDS',
    description:
      '\u201CKnowing what you are needing is essential because it helps you move from emotional overwhelm to clear, compassionate action that truly supports your well being.\u201D',
    icon: 'psychology',
    practiceLabel: 'Today\u2019s Practice',
    practiceText:
      '\u201CIdentify one physical or emotional need you are currently suppressing and name one small action to meet it.\u201D',
    dose: { dopamine: 0, oxytocin: 5, serotonin: 10, endorphins: 0 },
    wheelGradient: [colors.gradient['warm-orange'], colors.primary.pink],
    wheelLabel: 'Needs',
    wheelSubtext: 'figure out what your current needs are',
  },
  {
    type: 'wants',
    title: 'WANTS',
    description:
      '\u201CCelebrating a micro win each day builds momentum, reinforces progress, and trains your brain to focus on growth instead of fear fueling motivation and confidence over time.\u201D',
    icon: 'emoji-events',
    practiceLabel: 'Today\u2019s Practice',
    practiceText:
      '\u201CPick one small task you\u2019ve been avoiding and finish it in the next 10 minutes.\u201D',
    dose: { dopamine: 10, oxytocin: 0, serotonin: 5, endorphins: 0 },
    wheelGradient: [colors.accent.yellow, colors.gradient['light-gold']],
    wheelLabel: 'Wants',
    wheelSubtext: 'determine what you would like to achieve',
  },
];

export function getMysteryChallenge(type: MysteryType): MysteryChallenge {
  return MYSTERY_CHALLENGES.find((c) => c.type === type)!;
}

export function getRandomMysteryType(): MysteryType {
  const types: MysteryType[] = [
    'breathing',
    'gratitude',
    'affirmations',
    'feelings',
    'needs',
    'wants',
  ];
  return types[Math.floor(Math.random() * types.length)];
}
