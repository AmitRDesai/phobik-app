import { MaterialIcons } from '@expo/vector-icons';

export interface ChallengeBullet {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  text: string;
}

export interface ChallengeCard {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
}

export interface EmpathyDay {
  day: number;
  title: string;
  subtitle: string;
  badge: string;
  intention: string;
  challengeHeader?: string;
  challengeText: string;
  challengeHighlight?: string;
  challengeBullets?: ChallengeBullet[];
  challengeCards?: ChallengeCard[];
  reflectionLabel: string;
  reflectionPlaceholder: string;
  calendarDescription: string;
  buttonLabel?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export const EMPATHY_DAYS: EmpathyDay[] = [
  {
    day: 1,
    title: 'See Through New Eyes',
    subtitle: 'Perspective Empathy',
    badge: 'Perspective Empathy',
    intention: '\u201CI can understand without needing to agree.\u201D',
    challengeText:
      'Think of someone who triggered frustration or annoyance in you today. Pause and ask yourself:',
    challengeHighlight:
      '\u201CWhat might they be worried about or trying to protect?\u201D',
    reflectionLabel: 'Write one sentence from their point of view:',
    reflectionPlaceholder:
      'Example: \u201CI am acting defensively because I\u2019m afraid of losing my job...\u201D',
    calendarDescription:
      'Practice listening without interrupting for 10 minutes. Focus entirely on the speaker\u2019s emotions.',
  },
  {
    day: 2,
    title: 'Tune In, Don\u2019t Fix',
    subtitle: 'Emotional Empathy',
    badge: 'Emotional Empathy',
    intention: 'Feeling with others builds connection.',
    challengeText:
      'When someone shares something hard, resist the urge to fix or provide solutions immediately.',
    challengeHighlight:
      '\u201CTake a slow breath and notice what they might be feeling.\u201D',
    reflectionLabel:
      'What sensations did I notice in my own body as I listened?',
    reflectionPlaceholder: 'Notice tightness in chest, warmth, pulse...',
    calendarDescription:
      'Resist the urge to fix. Just listen and feel with them.',
  },
  {
    day: 3,
    title: 'Pause Before You Reply',
    subtitle: 'Reactive Empathy',
    badge: 'Mindful Response',
    intention: 'Pause \u2022 Sense \u2022 Choose',
    challengeText:
      'Before responding to a message or comment, consciously interrupt your immediate reaction:',
    challengeBullets: [
      {
        icon: 'chat-bubble',
        iconColor: '#fbbf24',
        text: '\u201CWhat might they be feeling?\u201D',
      },
      {
        icon: 'favorite',
        iconColor: '#f472b6',
        text: '\u201CWhat am I feeling?\u201D',
      },
      {
        icon: 'air',
        iconColor: '#c4b5fd',
        text: 'Take one grounding breath, then respond with awareness.',
      },
    ],
    reflectionLabel: 'How did empathy change my tone or response?',
    reflectionPlaceholder: 'Share your experience...',
    calendarDescription:
      'Consciously pause before responding. Interrupt your immediate reaction.',
  },
  {
    day: 4,
    title: 'Stay Open, Stay Grounded',
    subtitle: 'Boundary-Based Empathy',
    badge: 'Compassionate Boundaries',
    intention: '\u201CI can stay open without absorbing.\u201D',
    challengeText:
      'When you sense someone\u2019s pain, place one hand over your heart. Repeat quietly:',
    challengeHighlight:
      '\u201CTheir feelings are theirs.\nI can be kind and centered.\u201D',
    reflectionLabel: 'How did boundaries help me stay compassionate?',
    reflectionPlaceholder: 'Record your experience...',
    calendarDescription:
      'Practice staying present for someone while keeping a gentle boundary.',
  },
  {
    day: 5,
    title: 'Kindness in Motion',
    subtitle: 'Action-Based Empathy',
    badge: 'Empathy in Action',
    intention: 'Empathy grows through small gestures.',
    challengeText:
      'Do one simple act of care \u2014 text appreciation, listen fully, smile first, or hold space for someone who needs it.',
    reflectionLabel: 'How did that act shift my own energy or outlook?',
    reflectionPlaceholder: 'Write your thoughts here...',
    calendarDescription: 'Do one simple act of care for someone today.',
  },
  {
    day: 6,
    title: 'Support Without Absorbing',
    subtitle: 'Resilient Compassion',
    badge: 'Resilient Compassion',
    intention: '\u201CI can help without burning out.\u201D',
    challengeHeader: 'The Challenge',
    challengeText:
      'Notice if you\u2019ve taken on someone\u2019s emotion. Take three steady breaths and imagine releasing that feeling with love.',
    reflectionLabel: 'What does balanced compassion feel like in my body?',
    reflectionPlaceholder: 'Describe the physical sensations...',
    calendarDescription:
      'Notice if you\u2019ve taken on someone\u2019s emotion and practice releasing it.',
  },
  {
    day: 7,
    title: 'The Empathy Loop',
    subtitle: 'Integration & Full Cycle',
    badge: 'Full Circle',
    intention:
      '\u201CEmpathy is a muscle that strengthens with use. Today, I close the loop by turning my understanding into a meaningful action.\u201D',
    challengeHeader: 'The Final Challenge',
    challengeText:
      'Focus on a real interaction today and complete the Empathy Loop:',
    challengeCards: [
      {
        icon: 'psychology',
        title: 'Perspective Taking',
        description:
          'What might this person be thinking right now? Step into their world.',
      },
      {
        icon: 'favorite',
        title: 'Emotional Resonance',
        description:
          'What might they be feeling beneath the surface? Feel with them.',
      },
      {
        icon: 'volunteer-activism',
        title: 'Compassionate Action',
        description:
          'What kind act could I offer? Close the loop with a gesture.',
      },
    ],
    reflectionLabel:
      'How does empathy ripple through your relationships today?',
    reflectionPlaceholder: 'The ripple starts here...',
    calendarDescription:
      'Complete the Empathy Loop: Think, Feel, Act with heart.',
    buttonLabel: 'Finish Challenge',
    icon: 'stars',
  },
];
