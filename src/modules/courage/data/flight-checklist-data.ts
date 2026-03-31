import { MaterialIcons } from '@expo/vector-icons';

export interface ChecklistItem {
  id: string;
  category?: string;
  text: string;
  description?: string;
  highlight?: 'pink' | 'yellow';
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export interface PhaseChecklist {
  title: string;
  phaseBadge?: string;
  subtitle?: string;
  items: ChecklistItem[];
  ctaLabel: string;
  statusText?: string;
  nextPhase?: string;
}

export const PHASE_CHECKLISTS: Record<string, PhaseChecklist> = {
  'before-airport': {
    title: 'Before the Airport',
    phaseBadge: 'Pre-Flight Phase',
    items: [
      {
        id: '1',
        category: 'Acknowledgment',
        text: 'Name what\u2019s happening',
        description:
          'My body may feel activated \u2014 that does not mean I\u2019m unsafe.',
      },
      {
        id: '2',
        category: 'Preparation',
        text: 'Select a breathing practice',
        description: 'Choose ONE: Box Breathing, Figure-8, or Double Inhale.',
      },
      {
        id: '3',
        category: 'Action',
        text: '2 minutes of slow breathing',
        description:
          '\u201CProgress over perfection.\u201D Focus longer on the exhale.',
      },
      {
        id: '4',
        category: 'Mindset',
        text: 'Set an intention',
        description:
          'I will get curious with my fear instead of trying to eliminate it.',
      },
    ],
    ctaLabel: 'Next Step',
    statusText: 'Preparing for transit phase',
    nextPhase: 'at-airport',
  },

  'at-airport': {
    title: 'At the Airport',
    phaseBadge: 'Current Phase',
    items: [
      {
        id: '1',
        category: 'Action',
        text: 'Pause when entering the terminal',
      },
      {
        id: '2',
        category: 'Grounding',
        text: 'Familiarize yourself with your environment',
        description: 'Look for your favorite colors, people that smile etc.',
      },
      {
        id: '3',
        category: 'Reframe',
        text: 'Busy airport does not mean unsafe',
      },
      {
        id: '4',
        category: 'Affirmation',
        text: 'I can move slowly even if the environment is fast',
      },
    ],
    ctaLabel: 'Next Step',
    statusText: 'Ready for boarding phase',
    nextPhase: 'once-seated',
  },

  'once-seated': {
    title: 'Once Seated',
    subtitle:
      'Focus on the present moment. Your safety is managed by professionals.',
    items: [
      { id: '1', text: 'Feet flat on floor' },
      { id: '2', text: 'Sit fully back in seat' },
      { id: '3', text: 'Drop shoulders' },
      { id: '4', text: 'Unclench jaw' },
    ],
    ctaLabel: 'Next Step',
    nextPhase: 'during-takeoff',
  },

  'during-takeoff': {
    title: 'During Takeoff',
    items: [
      {
        id: '1',
        category: 'Sensation',
        text: 'Expect regular sensations',
        description: 'Noise, Vibration, Acceleration',
      },
      {
        id: '2',
        category: 'Breathwork',
        text: 'Inhale through nose \u2192 long exhale through mouth',
      },
      {
        id: '3',
        category: 'Mindset',
        text: 'This is a sensation, that\u2019s all right. I am okay.',
        description:
          'Allow these sensations to be here without the need to do anything different. You are not alone.',
      },
      {
        id: '4',
        category: 'Embodiment',
        text: 'Let the body react: sensations rise and fall',
      },
    ],
    ctaLabel: 'Next Step',
    nextPhase: 'during-turbulence',
  },

  'during-turbulence': {
    title: 'During Turbulence',
    items: [
      { id: '1', text: 'Sit fully back in seat' },
      { id: '2', text: 'Drop shoulders' },
      { id: '3', text: 'Soften belly' },
      {
        id: '4',
        text: 'Remind yourself:',
        description:
          'Turbulence is uncomfortable, not unsafe. I got this! I can handle it, I can tolerate this.',
      },
      {
        id: '5',
        text: 'If thoughts escalate \u2192 5-4-3-2-1 grounding',
      },
      {
        id: '6',
        text: 'Allow the movement:',
        description: 'The sky can wiggle. I can too.',
        highlight: 'pink',
      },
    ],
    ctaLabel: 'Next Step',
    nextPhase: 'during-landing',
  },

  'during-landing': {
    title: 'During Landing',
    phaseBadge: 'Current Phase',
    subtitle:
      'As the plane begins its descent, pilots carefully follow a controlled approach. Landing is a routine, well-practiced process. Focus on deep breathing, grounding exercises, or visualizing a smooth landing to stay calm and confident.',
    items: [
      {
        id: '1',
        text: 'Expect normal changes in engine sound and flap movement',
        icon: 'settings-input-component',
      },
      {
        id: '2',
        text: 'Ears may feel pressure; try swallowing or yawning',
        icon: 'hearing',
      },
      {
        id: '3',
        text: 'I am arriving safely and grounded',
        icon: 'favorite',
        highlight: 'pink',
      },
      {
        id: '4',
        text: 'Notice the transition from air to solid ground',
        icon: 'grid-view',
      },
    ],
    ctaLabel: 'Practice Completed',
  },
};

export const ANCHOR_OPTIONS: {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: 'journal', label: 'Journal', icon: 'edit-note' },
  { id: 'sound-therapy', label: 'Sound Therapy', icon: 'graphic-eq' },
  { id: 'podcast', label: 'Podcast', icon: 'podcasts' },
  { id: 'movie', label: 'Movie', icon: 'movie' },
  { id: 'book', label: 'Book', icon: 'menu-book' },
  { id: 'breathing', label: 'Breathing', icon: 'air' },
  { id: 'chewing-gum', label: 'Chewing Gum', icon: 'restaurant' },
  { id: 'music', label: 'Music', icon: 'music-note' },
  { id: '54321', label: '5-4-3-2-1', icon: 'format-list-numbered' },
  { id: 'other', label: 'Other', icon: 'more-horiz' },
];
