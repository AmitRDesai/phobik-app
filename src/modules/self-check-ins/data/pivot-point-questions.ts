export type PivotPattern =
  | 'pusher'
  | 'escaper'
  | 'freezer'
  | 'pleaser'
  | 'regulator';

export interface PivotSection {
  id: number;
  title: string;
  subtitle: string;
}

export interface PivotQuestion {
  id: number;
  sectionId: number;
  text: string;
  pattern: PivotPattern;
}

export const PIVOT_SECTIONS: PivotSection[] = [
  {
    id: 1,
    title: 'Your First Reaction',
    subtitle: 'When something stressful or uncertain happens\u2026',
  },
  {
    id: 2,
    title: 'Thought Patterns',
    subtitle: 'When I feel stressed, my thoughts tend to\u2026',
  },
  {
    id: 3,
    title: 'Behavior Under Pressure',
    subtitle: 'When I\u2019m anxious or overwhelmed\u2026',
  },
  {
    id: 4,
    title: 'Recovery & Regulation',
    subtitle: 'After a stressful experience\u2026',
  },
  {
    id: 5,
    title: 'Courage & Action',
    subtitle: 'When something matters but feels uncomfortable\u2026',
  },
];

export const PIVOT_QUESTIONS: PivotQuestion[] = [
  // Section 1: Your First Reaction
  {
    id: 1,
    sectionId: 1,
    text: 'I immediately try to fix or control the situation',
    pattern: 'pusher',
  },
  {
    id: 2,
    sectionId: 1,
    text: 'I avoid thinking about it and distract myself',
    pattern: 'escaper',
  },
  {
    id: 3,
    sectionId: 1,
    text: 'I feel stuck and unsure what to do next',
    pattern: 'freezer',
  },
  {
    id: 4,
    sectionId: 1,
    text: 'I focus on keeping others calm or happy',
    pattern: 'pleaser',
  },
  {
    id: 5,
    sectionId: 1,
    text: 'I pause before reacting',
    pattern: 'regulator',
  },
  {
    id: 6,
    sectionId: 1,
    text: 'I jump into action quickly, even if I\u2019m overwhelmed',
    pattern: 'pusher',
  },
  {
    id: 7,
    sectionId: 1,
    text: 'I delay dealing with it',
    pattern: 'escaper',
  },
  {
    id: 8,
    sectionId: 1,
    text: 'I overthink and replay the situation in my mind',
    pattern: 'freezer',
  },
  {
    id: 9,
    sectionId: 1,
    text: 'I worry about how others will react to me',
    pattern: 'pleaser',
  },
  {
    id: 10,
    sectionId: 1,
    text: 'I take a moment to check in with myself',
    pattern: 'regulator',
  },

  // Section 2: Thought Patterns
  {
    id: 11,
    sectionId: 2,
    text: 'Become urgent and intense (\u201CI need to fix this now\u201D)',
    pattern: 'pusher',
  },
  {
    id: 12,
    sectionId: 2,
    text: 'Drift toward distractions or avoidance',
    pattern: 'escaper',
  },
  {
    id: 13,
    sectionId: 2,
    text: 'Loop and overanalyze without resolution',
    pattern: 'freezer',
  },
  {
    id: 14,
    sectionId: 2,
    text: 'Focus on what others might think of me',
    pattern: 'pleaser',
  },
  {
    id: 15,
    sectionId: 2,
    text: 'Stay relatively grounded and clear',
    pattern: 'regulator',
  },
  {
    id: 16,
    sectionId: 2,
    text: 'Push me to take control of everything',
    pattern: 'pusher',
  },
  {
    id: 17,
    sectionId: 2,
    text: 'Tell me to deal with it later',
    pattern: 'escaper',
  },
  {
    id: 18,
    sectionId: 2,
    text: 'Make me feel overwhelmed or frozen',
    pattern: 'freezer',
  },
  {
    id: 19,
    sectionId: 2,
    text: 'Make me second-guess myself',
    pattern: 'pleaser',
  },
  {
    id: 20,
    sectionId: 2,
    text: 'Help me step back and gain perspective',
    pattern: 'regulator',
  },

  // Section 3: Behavior Under Pressure
  {
    id: 21,
    sectionId: 3,
    text: 'I overwork or try to push through it',
    pattern: 'pusher',
  },
  {
    id: 22,
    sectionId: 3,
    text: 'I procrastinate or escape into distractions',
    pattern: 'escaper',
  },
  {
    id: 23,
    sectionId: 3,
    text: 'I shut down or feel unable to act',
    pattern: 'freezer',
  },
  {
    id: 24,
    sectionId: 3,
    text: 'I prioritize others over myself',
    pattern: 'pleaser',
  },
  {
    id: 25,
    sectionId: 3,
    text: 'I take small, manageable steps forward',
    pattern: 'regulator',
  },
  {
    id: 26,
    sectionId: 3,
    text: 'I take on too much responsibility',
    pattern: 'pusher',
  },
  {
    id: 27,
    sectionId: 3,
    text: 'I avoid the situation as long as possible',
    pattern: 'escaper',
  },
  {
    id: 28,
    sectionId: 3,
    text: 'I wait until I feel ready before acting',
    pattern: 'freezer',
  },
  {
    id: 29,
    sectionId: 3,
    text: 'I seek reassurance from others',
    pattern: 'pleaser',
  },
  {
    id: 30,
    sectionId: 3,
    text: 'I do one thing that helps me move forward',
    pattern: 'regulator',
  },

  // Section 4: Recovery & Regulation
  {
    id: 31,
    sectionId: 4,
    text: 'I stay tense or activated for a long time',
    pattern: 'pusher',
  },
  {
    id: 32,
    sectionId: 4,
    text: 'I distract myself to avoid feeling it',
    pattern: 'escaper',
  },
  {
    id: 33,
    sectionId: 4,
    text: 'I feel drained and struggle to reset',
    pattern: 'freezer',
  },
  {
    id: 34,
    sectionId: 4,
    text: 'I feel resentful or emotionally depleted',
    pattern: 'pleaser',
  },
  {
    id: 35,
    sectionId: 4,
    text: 'I\u2019m able to calm myself and recover',
    pattern: 'regulator',
  },
  {
    id: 36,
    sectionId: 4,
    text: 'I have trouble letting things go',
    pattern: 'pusher',
  },
  {
    id: 37,
    sectionId: 4,
    text: 'I numb out or check out',
    pattern: 'escaper',
  },
  {
    id: 38,
    sectionId: 4,
    text: 'I replay what happened over and over',
    pattern: 'freezer',
  },
  {
    id: 39,
    sectionId: 4,
    text: 'I worry about how I handled things',
    pattern: 'pleaser',
  },
  {
    id: 40,
    sectionId: 4,
    text: 'I can return to a steady state within a reasonable time',
    pattern: 'regulator',
  },

  // Section 5: Courage & Action
  {
    id: 41,
    sectionId: 5,
    text: 'I push myself aggressively to get through it',
    pattern: 'pusher',
  },
  {
    id: 42,
    sectionId: 5,
    text: 'I avoid it or put it off',
    pattern: 'escaper',
  },
  {
    id: 43,
    sectionId: 5,
    text: 'I feel paralyzed or stuck',
    pattern: 'freezer',
  },
  {
    id: 44,
    sectionId: 5,
    text: 'I worry about disappointing others',
    pattern: 'pleaser',
  },
  {
    id: 45,
    sectionId: 5,
    text: 'I take one small step anyway',
    pattern: 'regulator',
  },
  {
    id: 46,
    sectionId: 5,
    text: 'I feel pressure to get it right',
    pattern: 'pusher',
  },
  {
    id: 47,
    sectionId: 5,
    text: 'I wait until the discomfort goes away',
    pattern: 'escaper',
  },
  {
    id: 48,
    sectionId: 5,
    text: 'I hesitate because I don\u2019t feel ready',
    pattern: 'freezer',
  },
  {
    id: 49,
    sectionId: 5,
    text: 'I look for approval before acting',
    pattern: 'pleaser',
  },
  {
    id: 50,
    sectionId: 5,
    text: 'I move forward even if I feel uncertain',
    pattern: 'regulator',
  },
];

export const PIVOT_RATING_LABELS = [
  'Not like me',
  'A little like me',
  'Sometimes like me',
  'Mostly like me',
  'Very much like me',
] as const;

export const TOTAL_PIVOT_QUESTIONS = PIVOT_QUESTIONS.length;
