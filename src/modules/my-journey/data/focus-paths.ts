import type { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

export const FOCUS_PATHS = [
  {
    id: 'build-strength',
    label: 'Build Strength',
    description: 'Move more, feel stronger, and support your body',
    icon: 'barbell',
  },
  {
    id: 'find-calm',
    label: 'Find Calm',
    description: 'Reduce overwhelm and create more balance',
    icon: 'leaf',
  },
  {
    id: 'sleep-restore',
    label: 'Sleep & Restore',
    description: 'Build routines that support deeper rest and recovery',
    icon: 'moon',
  },
  {
    id: 'boost-energy',
    label: 'Boost Energy',
    description: 'Increase vitality and recharge your mind and body',
    icon: 'flash',
  },
  {
    id: 'sharpen-focus',
    label: 'Sharpen Focus',
    description: 'Improve clarity and strengthen attention',
    icon: 'eye',
  },
  {
    id: 'feel-better',
    label: 'Feel Better',
    description: 'Create small habits that support overall well-being',
    icon: 'heart',
  },
  {
    id: 'grow-confidence',
    label: 'Grow Confidence',
    description: 'Build courage through small daily actions',
    icon: 'shield',
  },
  {
    id: 'strengthen-connection',
    label: 'Strengthen Connection',
    description: 'Invest in relationships and meaningful moments',
    icon: 'people',
  },
  {
    id: 'create-your-own',
    label: 'Create Your Own',
    description: 'Design a path around what matters most to you',
    icon: 'create',
  },
] as const satisfies readonly {
  id: string;
  label: string;
  description: string;
  icon: IoniconName;
}[];

export type FocusPath = (typeof FOCUS_PATHS)[number];
export type FocusPathId = FocusPath['id'];

export function findFocusPath(id: string): FocusPath | undefined {
  return FOCUS_PATHS.find((p) => p.id === id);
}
