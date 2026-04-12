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
  {
    id: 8,
    section: 'Speaker Role',
    text: 'After I speak, I am willing to pause and allow the other person to take the Inquirer role.',
    insight: {
      title: 'Why this matters',
      body: 'True connection requires a rhythmic exchange. By consciously stepping back, you create the sacred space needed for the other person to feel heard and for the conversation to shift from a monologue to a healing dialogue.',
    },
  },
  {
    id: 9,
    section: 'Listener Role',
    text: 'When I\u2019m listening, I try to fully hear my partner\u2019s experience, rather than immediately launching into my own stories or defenses.',
    insight: {
      title: 'Why this matters',
      body: 'Active listening reduces conflict by ensuring the other person feels seen and heard before you respond.',
    },
  },
  {
    id: 10,
    section: 'Listener Role',
    text: 'I summarise or restate what they said (in my own words) to check I understood them, before giving my viewpoint.',
    insight: {
      title: 'Why this matters',
      body: 'Paraphrasing prevents misunderstandings and demonstrates cognitive empathy. By echoing your partner\u2019s intent, you validate their experience before introducing your own perspective.',
    },
  },
  {
    id: 11,
    section: 'Listener Role',
    text: 'I ask open-ended questions (e.g., \u201CCan you tell me more about what this feels like?\u201D) rather than closed ones (\u201CWhy did you do that?\u201D).',
    insight: {
      title: 'Why this matters',
      body: 'Open questions invite exploration and reduce the feeling of being interrogated. This fosters a safe space for vulnerability and deeper connection.',
    },
  },
  {
    id: 12,
    section: 'Listener Role',
    text: 'I resist the impulse to \u201Cfix\u201D or solve the moment right away; instead I stay curious about their experience.',
    insight: {
      title: 'Why this matters',
      body: 'Deep listening requires presence without the pressure to provide immediate solutions.',
    },
  },
  {
    id: 13,
    section: 'Listener Role',
    text: 'I respond with empathy \u2014 acknowledging their feelings and what might be under the surface \u2014 rather than judging or dismissing.',
    insight: {
      title: 'Why this matters',
      body: 'Empathy builds emotional safety and deepens intimacy by validating your partner\u2019s internal experience without judgment.',
    },
  },
  {
    id: 14,
    section: 'Listener Role',
    text: 'I allow space and silence after they speak, rather than rushing to fill it with my response.',
    insight: {
      title: 'Why this matters',
      body: 'Silence allows emotions to settle and provides space for deeper reflection.',
    },
  },
  {
    id: 15,
    section: 'Listener Role',
    text: 'I am aware of my own internal reactions and try not to hijack the conversation.',
    insight: {
      title: 'Why this matters',
      body: 'Self-awareness prevents personal triggers from disrupting the connection loop.',
    },
  },
  {
    id: 16,
    section: 'Listener Role',
    text: 'I switch into the Initiator role only after my partner has had time to speak, and I feel I have heard them sufficiently.',
    insight: {
      title: 'Why this matters',
      body: 'Balanced turn-taking ensures both partners feel respected and valued.',
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
