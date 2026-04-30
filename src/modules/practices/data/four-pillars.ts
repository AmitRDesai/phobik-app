import { colors } from '@/constants/colors';
import type { MaterialIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';

import bodyBg from '@/assets/images/four-pillars/pillar-body.jpg';
import emotionBg from '@/assets/images/four-pillars/pillar-emotion.jpg';
import mindBg from '@/assets/images/four-pillars/pillar-mind.jpg';
import relationshipBg from '@/assets/images/four-pillars/pillar-relationship.jpg';

import bodyBreatheImg from '@/assets/images/four-pillars/body-breathe.jpg';
import bodyMeditationImg from '@/assets/images/four-pillars/body-meditation.jpg';
import bodyMovementImg from '@/assets/images/four-pillars/body-movement.jpg';
import bodySleepImg from '@/assets/images/four-pillars/body-sleep.jpg';

import mindMicroImg from '@/assets/images/four-pillars/mind-micro.jpg';
import mindMysteryImg from '@/assets/images/four-pillars/mind-mystery.jpg';
import mindSelfCheckinImg from '@/assets/images/four-pillars/mind-self-checkin.jpg';
import mindSpecializedImg from '@/assets/images/four-pillars/mind-specialized.jpg';

import emotionJournalImg from '@/assets/images/four-pillars/emotion-journal.jpg';
import emotionSelfCompassionImg from '@/assets/images/four-pillars/emotion-self-compassion.jpg';
import emotionSoundStudioImg from '@/assets/images/four-pillars/emotion-sound-studio.jpg';

import relationshipEmpathyImg from '@/assets/images/four-pillars/relationship-empathy.jpg';
import relationshipIntimacyImg from '@/assets/images/four-pillars/relationship-intimacy.jpg';

export type PillarId = 'body' | 'mind' | 'emotion' | 'relationship';

export type PillarHubCard = {
  id: PillarId;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: number;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  accentColor: string;
};

export type PillarSubItem = {
  id: string;
  title: string;
  subtitle?: string;
  image: number;
  /** If set, push this route on tap. */
  route?: Href;
  /** If true, tapping shows a coming-soon dialog. */
  comingSoon?: boolean;
  badge?: string;
  /** Optional Material icon shown on the card */
  icon?: keyof typeof MaterialIcons.glyphMap;
  /** Tints the icon */
  accentColor?: string;
  /** Optional CTA label rendered as a gradient pill at the bottom of the card */
  cta?: string;
  /** Optional Material icon shown after the CTA label */
  ctaIcon?: keyof typeof MaterialIcons.glyphMap;
};

export type PillarSubMenu = {
  id: PillarId;
  title: string;
  accent: string;
  subtitle?: string;
  items: PillarSubItem[];
};

export const PILLAR_HUB: {
  hero: { title: string; accent: string; subtitle: string };
  cards: PillarHubCard[];
} = {
  hero: {
    title: 'NERVOUS SYSTEM',
    accent: 'REGULATION',
    subtitle: 'What kind of support do you need?',
  },
  cards: [
    {
      id: 'body',
      eyebrow:
        'Goal: rapidly downshift physiological arousal (Fight/Flight to Calm)',
      title: 'BODY-BASED REGULATION',
      subtitle:
        'Best for panic spikes, physical anxiety, racing heart or shallow breathing.',
      image: bodyBg,
      route: '/practices/body-regulation',
      icon: 'self-improvement',
      accentColor: colors.primary.pink,
    },
    {
      id: 'mind',
      eyebrow: 'Goal: Quiet mental loops + regain cognitive control',
      title: 'MIND-BASED REGULATION',
      subtitle:
        'Best for rumination, overthinking & catastrophic thinking loops.',
      image: mindBg,
      route: '/practices/mind-regulation',
      icon: 'psychology',
      accentColor: colors.accent.yellow,
    },
    {
      id: 'emotion',
      eyebrow: 'Goal: Safely process & release emotional intensity',
      title: 'EMOTION-BASED REGULATION',
      subtitle:
        'Best for emotional overwhelm, sadness, fear, grief or feeling emotionally stuck.',
      image: emotionBg,
      route: '/practices/emotion-regulation',
      icon: 'favorite',
      accentColor: colors.primary.pink,
    },
    {
      id: 'relationship',
      eyebrow: 'Goal: Create safety, connection, and grounded presence',
      title: 'RELATIONSHIP-BASED REGULATION',
      subtitle:
        'Best for loneliness, nervous system dysregulation, need for comfort or safety.',
      image: relationshipBg,
      route: '/practices/relationship-regulation',
      icon: 'groups',
      accentColor: colors.accent.yellow,
    },
  ],
};

export const BODY_SUBMENU: PillarSubMenu = {
  id: 'body',
  title: 'BODY-BASED',
  accent: 'REGULATION',
  subtitle: 'Directly shift your physiological state.',
  items: [
    {
      id: 'movement',
      title: 'MOVEMENT',
      subtitle: 'Dynamic energy and physical release.',
      image: bodyMovementImg,
      route: '/practices/body/movement',
      icon: 'fitness-center',
      accentColor: colors.primary.pink,
    },
    {
      id: 'breathe',
      title: 'BREATHE',
      subtitle: 'Direct nervous system downshifting.',
      image: bodyBreatheImg,
      route: '/practices/body/breathe',
      icon: 'air',
      accentColor: colors.accent.yellow,
    },
    {
      id: 'meditation',
      title: 'MEDITATION',
      subtitle: 'Stillness and inner observation.',
      image: bodyMeditationImg,
      route: '/practices/body/meditation',
      icon: 'spa',
      accentColor: colors.accent.yellow,
    },
    {
      id: 'sleep',
      title: 'SLEEP',
      subtitle: 'Deep restoration and rest.',
      image: bodySleepImg,
      route: '/practices/sleep-meditation-session',
      icon: 'bedtime',
      accentColor: colors.primary.pink,
    },
  ],
};

export const MIND_SUBMENU: PillarSubMenu = {
  id: 'mind',
  title: 'MIND-BASED',
  accent: 'REGULATION',
  subtitle: 'Sharpen your focus and reclaim mental clarity.',
  items: [
    {
      id: 'micro-challenges',
      title: 'MICRO CHALLENGES',
      subtitle: 'Tiny daily resets that build mental momentum.',
      image: mindMicroImg,
      route: '/practices/micro-challenges',
      icon: 'flash-on',
      accentColor: colors.primary.pink,
      cta: 'Start Now',
      ctaIcon: 'arrow-forward',
    },
    {
      id: 'mystery-challenges',
      title: 'MYSTERY CHALLENGES',
      subtitle: 'Surprise prompts to break out of mental loops.',
      image: mindMysteryImg,
      route: '/practices/mystery-challenge',
      icon: 'auto-awesome',
      accentColor: colors.accent.yellow,
      cta: 'Discover',
      ctaIcon: 'flare',
    },
    {
      id: 'specialized-packs',
      title: 'SPECIALIZED PACKS',
      subtitle: 'Targeted toolkits for specific stress patterns.',
      image: mindSpecializedImg,
      route: '/practices/specialized-packs',
      icon: 'inventory-2',
      accentColor: colors.primary.pink,
      cta: 'Explore',
      ctaIcon: 'travel-explore',
    },
    {
      id: 'self-check-ins',
      title: 'SELF CHECK-INS',
      subtitle: 'Quick assessments to map where your mind is right now.',
      image: mindSelfCheckinImg,
      route: '/practices/self-check-ins',
      icon: 'checklist',
      accentColor: colors.accent.yellow,
      cta: 'Get Curious',
      ctaIcon: 'explore',
    },
  ],
};

export const EMOTION_SUBMENU: PillarSubMenu = {
  id: 'emotion',
  title: 'EMOTION-BASED',
  accent: 'REGULATION',
  items: [
    {
      id: 'journal',
      title: 'JOURNAL',
      subtitle: 'Focus on what matters.',
      image: emotionJournalImg,
      route: '/journal',
      icon: 'edit-note',
      accentColor: colors.primary.pink,
      cta: 'Start Writing',
      ctaIcon: 'arrow-forward',
    },
    {
      id: 'sound-studio',
      title: 'SOUND STUDIO',
      subtitle: 'Choose or Create Immersive Sounds that shift how you feel.',
      image: emotionSoundStudioImg,
      route: '/practices/emotion/sound-studio',
      icon: 'graphic-eq',
      accentColor: colors.accent.yellow,
      cta: 'Tune In',
      ctaIcon: 'headphones',
    },
    {
      id: 'self-compassion',
      title: 'SELF COMPASSION',
      subtitle: 'A guided exercise in self compassion',
      image: emotionSelfCompassionImg,
      route: '/practices/gentle-letter',
      icon: 'favorite',
      accentColor: colors.primary.pink,
      cta: 'Begin Practice',
      ctaIcon: 'auto-awesome',
    },
  ],
};

export const RELATIONSHIP_SUBMENU: PillarSubMenu = {
  id: 'relationship',
  title: 'RELATIONSHIP-BASED',
  accent: 'REGULATION',
  items: [
    {
      id: 'empathy-challenge',
      title: '7 DAY EMPATHY CHALLENGE',
      subtitle: 'Build deep connection and understanding.',
      badge: 'Active Journey',
      image: relationshipEmpathyImg,
      route: '/practices/empathy-challenge',
      accentColor: colors.primary.pink,
      cta: 'Start Challenge',
      ctaIcon: 'bolt',
    },
    {
      id: 'intimacy-test',
      title: 'INTIMACY TEST',
      subtitle: 'Discover the hidden layers of your bond.',
      badge: 'Discovery',
      image: relationshipIntimacyImg,
      route: '/practices/self-check-ins/intimacy-intro',
      accentColor: colors.accent.yellow,
      cta: 'Take Test',
      ctaIcon: 'analytics',
    },
  ],
};

export const PILLAR_SUBMENUS: Record<PillarId, PillarSubMenu> = {
  body: BODY_SUBMENU,
  mind: MIND_SUBMENU,
  emotion: EMOTION_SUBMENU,
  relationship: RELATIONSHIP_SUBMENU,
};
