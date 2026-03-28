import { alpha, colors } from '@/constants/colors';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';

export type ButtonVariant = 'pink' | 'yellow' | 'ghost' | 'gradient';

export type GradientDirection = {
  start: { x: number; y: number };
  end: { x: number; y: number };
};

export type IconDef =
  | { family?: 'material'; name: keyof typeof MaterialIcons.glyphMap }
  | { family: 'ionicons'; name: keyof typeof Ionicons.glyphMap }
  | { family: 'community'; name: keyof typeof MaterialCommunityIcons.glyphMap };

export interface CourageOption {
  id: string;
  icon: IconDef;
  iconColor: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonIcon: keyof typeof MaterialIcons.glyphMap;
  buttonVariant: ButtonVariant;
  decorativeIcon: IconDef;
  decorativeIconColor: string;
  decorativeGradientColors: [string, string];
  decorativeGradientDirection: GradientDirection;
}

const pink = colors.primary.pink;
const yellow = colors.accent.yellow;

export const COURAGE_OPTIONS: CourageOption[] = [
  {
    id: 'micro-challenges',
    icon: { name: 'terrain' },
    iconColor: pink,
    title: 'Micro Challenges',
    description:
      'Your mood follows your chemistry - and you can change it. Start with one small habit today.',
    buttonLabel: 'Start Now',
    buttonIcon: 'chevron-right',
    buttonVariant: 'pink',
    decorativeIcon: { family: 'community', name: 'image-filter-hdr-outline' },
    decorativeIconColor: `${pink}CC`,
    decorativeGradientColors: [`${pink}4D`, `${pink}0D`],
    decorativeGradientDirection: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  },
  {
    id: 'mystery-challenge',
    icon: { name: 'auto-awesome' },
    iconColor: yellow,
    title: 'Mystery Challenge',
    description:
      'What if your mood was a code waiting to be cracked? Begin the experiment one habit at a time.',
    buttonLabel: 'Discover',
    buttonIcon: 'flare',
    buttonVariant: 'yellow',
    decorativeIcon: { family: 'community', name: 'flower-outline' },
    decorativeIconColor: `${yellow}CC`,
    decorativeGradientColors: [`${yellow}4D`, `${yellow}0D`],
    decorativeGradientDirection: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  },
  {
    id: 'specialized-packs',
    icon: { name: 'filter-drama' },
    iconColor: 'white',
    title: 'Specialized Packs',
    description: 'Explore deeper toolkits for specific situations and calm.',
    buttonLabel: 'Explore',
    buttonIcon: 'cloud-download',
    buttonVariant: 'ghost',
    decorativeIcon: { family: 'community', name: 'cloud-outline' },
    decorativeIconColor: alpha.white60,
    decorativeGradientColors: [alpha.white20, alpha.white15],
    decorativeGradientDirection: {
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    },
  },
  {
    id: 'self-check-ins',
    icon: { family: 'ionicons', name: 'compass-outline' },
    iconColor: pink,
    title: 'Self Check Ins',
    description: 'Assess your growth through guided evaluations and tracking.',
    buttonLabel: 'Get Curious',
    buttonIcon: 'checklist',
    buttonVariant: 'gradient',
    decorativeIcon: { family: 'community', name: 'compass-outline' },
    decorativeIconColor: `${yellow}B3`,
    decorativeGradientColors: [`${pink}1A`, `${yellow}1A`],
    decorativeGradientDirection: { start: { x: 1, y: 1 }, end: { x: 0, y: 0 } },
  },
];
