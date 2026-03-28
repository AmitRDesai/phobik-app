import { MaterialIcons } from '@expo/vector-icons';

export interface SpecializedPack {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  transformationGoal: string;
  heroIcon: keyof typeof MaterialIcons.glyphMap;
  accentIcon: keyof typeof MaterialIcons.glyphMap;
  ctaLabel: string;
  supportText: string;
  status: 'active' | 'coming-soon';
}

export const SPECIALIZED_PACKS: SpecializedPack[] = [
  {
    id: 'fear-of-flying',
    title: 'Fear of Flying',
    subtitle: 'Calm Above the Clouds',
    badge: 'Advanced',
    transformationGoal: 'Master the Skies',
    heroIcon: 'cloud',
    accentIcon: 'flight',
    ctaLabel: 'Unlock Full Journey',
    supportText: 'Includes 12 guided sessions & lifetime access',
    status: 'active',
  },
  {
    id: 'fear-of-missing-out',
    title: 'Fear of Missing Out',
    subtitle: 'Be Present, Not Connected',
    badge: 'Coming Soon',
    transformationGoal: 'Mindful Presence',
    heroIcon: 'notifications-off',
    accentIcon: 'group',
    ctaLabel: 'Coming Soon',
    supportText: 'Join the waitlist for early access',
    status: 'coming-soon',
  },
  {
    id: 'fear-of-intimacy',
    title: 'Fear of Intimacy',
    subtitle: 'Open Your Heart',
    badge: 'Coming Soon',
    transformationGoal: 'Deep Connection',
    heroIcon: 'favorite',
    accentIcon: 'lock-open',
    ctaLabel: 'Coming Soon',
    supportText: 'Join the waitlist for early access',
    status: 'coming-soon',
  },
];
