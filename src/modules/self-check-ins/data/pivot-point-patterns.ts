import type { PivotPattern } from './pivot-point-questions';

export interface PatternArchetype {
  pattern: PivotPattern;
  label: string;
  emoji: string;
  tagline: string;
  strength: string;
  growthEdge: string;
  recommendations: string[];
}

export const PATTERN_ARCHETYPES: Record<PivotPattern, PatternArchetype> = {
  pusher: {
    pattern: 'pusher',
    label: 'The Pusher',
    emoji: '\uD83D\uDD25',
    tagline: 'I handle stress by doing more.',
    strength: 'Driven, proactive',
    growthEdge: 'Slowing down, feeling more',
    recommendations: [
      'Breathwork (long exhale)',
      '\u201CSlow down\u201D prompts',
      'Emotional awareness',
    ],
  },
  escaper: {
    pattern: 'escaper',
    label: 'The Escaper',
    emoji: '\uD83C\uDFC3',
    tagline: 'I handle stress by avoiding it.',
    strength: 'Protects energy',
    growthEdge: 'Taking small action',
    recommendations: ['Courage challenges', 'Exposure steps', 'Action nudges'],
  },
  freezer: {
    pattern: 'freezer',
    label: 'The Freezer',
    emoji: '\uD83E\uDDCA',
    tagline: 'I handle stress by shutting down.',
    strength: 'Sensitive, aware',
    growthEdge: 'Safe activation',
    recommendations: ['Body activation', 'Micro steps', 'Grounding'],
  },
  pleaser: {
    pattern: 'pleaser',
    label: 'The Pleaser',
    emoji: '\uD83E\uDD1D',
    tagline: 'I handle stress by prioritizing others.',
    strength: 'Empathetic, relational',
    growthEdge: 'Boundaries + self-trust',
    recommendations: ['Boundary scripts', 'Self-trust exercises'],
  },
  regulator: {
    pattern: 'regulator',
    label: 'The Regulator',
    emoji: '\uD83C\uDF0A',
    tagline: 'I can feel stress and still move forward.',
    strength: 'Balanced, resilient',
    growthEdge: 'Continued expansion',
    recommendations: ['Growth challenges', 'Leadership expansion'],
  },
};
