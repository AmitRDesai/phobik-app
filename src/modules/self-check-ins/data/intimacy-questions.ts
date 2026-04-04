export interface IntimacyQuestion {
  id: number;
  section: string;
  text: string;
  insight: {
    title: string;
    body: string;
  };
}

export const INTIMACY_QUESTIONS: IntimacyQuestion[] = [
  {
    id: 1,
    section: 'Speaker Role',
    text: 'I bring up one issue only, rather than many issues at once.',
    insight: {
      title: 'Why this matters',
      body: '\u201CKitchen sinking\u201D\u2014bringing up multiple complaints at once\u2014overwhelms the listener and leads to defensive reactions. Focusing on a single, specific issue increases the likelihood of a productive resolution.',
    },
  },
  {
    id: 2,
    section: 'Speaker Role',
    text: 'When I speak, I use \u201CI-statements\u201D (e.g., \u201CI feel\u2026\u201D, \u201CI think\u2026\u201D) instead of blaming or accusing.',
    insight: {
      title: 'Why this matters',
      body: 'I-statements reduce defensiveness in others. By focusing on your own experience rather than pointing fingers, you create a safe space for dialogue and mutual understanding.',
    },
  },
  {
    id: 3,
    section: 'Speaker Role',
    text: 'I describe how I feel, think, and what I\u2019d like (or need) without focusing only on what the other person did wrong.',
    insight: {
      title: 'Why this matters',
      body: 'Using \u201CI\u201D statements shifts the focus from accusation to expression. This reduces defensiveness in others and opens a clearer pathway for your needs to be met without triggering conflict cycles.',
    },
  },
  {
    id: 4,
    section: 'Speaker Role',
    text: 'I stay open to learning something about myself during the conversation (rather than just trying to get my way).',
    insight: {
      title: 'Why this matters',
      body: 'Dialogue isn\u2019t just a vehicle for your needs; it\u2019s a mirror for your growth. Staying open to self-discovery prevents defensiveness and transforms a conflict into a shared evolution.',
    },
  },
  {
    id: 5,
    section: 'Speaker Role',
    text: 'I check when it\u2019s a good time to talk, and try not to initiate when emotions are too high.',
    insight: {
      title: 'Why this matters',
      body: 'Effective speakers prioritize connection over being heard. Timing and emotional regulation ensure your message is received with empathy rather than defensiveness.',
    },
  },
  {
    id: 6,
    section: 'Speaker Role',
    text: 'I avoid turning the issue into a \u201Cyou did this / you are always that\u201D speech \u2014 I stay focused on my experience.',
    insight: {
      title: 'Why this matters',
      body: 'Switching from \u201CYou\u201D statements to \u201CI\u201D statements reduces defensiveness in others. Focusing on your subjective experience transforms a potential attack into an invitation for understanding and empathy.',
    },
  },
  {
    id: 7,
    section: 'Speaker Role',
    text: 'I am willing to say things that feel vulnerable or uncomfortable, even if I might be misunderstood.',
    insight: {
      title: 'Why this matters',
      body: 'Authentic connection requires the courage to be seen without masks. By sharing your raw truth, you invite your partner into a deeper level of shared safety and understanding.',
    },
  },
];

export const INTIMACY_RATING_LABELS = [
  'Never',
  'Rarely',
  'Sometimes',
  'Often',
  'Always',
] as const;
