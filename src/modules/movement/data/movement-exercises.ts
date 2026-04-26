import type { MaterialIcons } from '@expo/vector-icons';
import type { Href } from 'expo-router';

import kundaliniImg from '@/assets/images/four-pillars/movement-kundalini.jpg';
import mindfulWalkingImg from '@/assets/images/four-pillars/movement-mindful-walking.jpg';
import physiologicalSighImg from '@/assets/images/four-pillars/movement-physiological-sigh.jpg';
import pmrImg from '@/assets/images/four-pillars/movement-pmr.jpg';
import qiGongImg from '@/assets/images/four-pillars/movement-qi-gong.jpg';
import taiChiImg from '@/assets/images/four-pillars/movement-tai-chi.jpg';

import listKundaliniImg from '@/assets/images/four-pillars/movement-list-kundalini.jpg';
import listMindfulWalkingImg from '@/assets/images/four-pillars/movement-list-mindful-walking.jpg';
import listPhysiologicalSighImg from '@/assets/images/four-pillars/movement-list-physiological-sigh.jpg';
import listPmrImg from '@/assets/images/four-pillars/movement-list-pmr.jpg';
import listQiGongImg from '@/assets/images/four-pillars/movement-list-qi-gong.jpg';
import listTaiChiImg from '@/assets/images/four-pillars/movement-list-tai-chi.jpg';

export type MovementMood =
  | 'Anxious'
  | 'Overthinking'
  | 'Scattered'
  | 'Tense'
  | 'Low Energy'
  | 'Stuck';

export type Benefit = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
};

export type MovementExercise = {
  id: string;
  /** Title shown on list rows + intro hero */
  title: string;
  /** Optional second line on the intro hero, gradient-tinted */
  titleAccent?: string;
  /** Eyebrow shown above the intro title — verbatim from HTML */
  eyebrow?: string;
  /** Short tag shown on list row (e.g., "Movement", "Flow") */
  category: string;
  /** Duration shown on list row */
  duration: string;
  /** One-line meta on the list row */
  meta: string;
  /** Moods this exercise is recommended for (used by the mood filter) */
  moods: MovementMood[];
  /** Body paragraphs for the intro screen — verbatim from HTML */
  body: string[];
  /** Stats shown on intro — verbatim from HTML when present */
  stats?: { label: string; value: string }[];
  /** Pills shown above the title on intro — verbatim from HTML when present */
  pills?: string[];
  /** Benefit cards (icon + short title + description) — verbatim from HTML when present */
  benefits?: Benefit[];
  /** Italic pull-quote shown below body — verbatim from HTML when present */
  quote?: string;
  /** Footer note shown below the CTA — verbatim from HTML when present */
  footerNote?: string;
  /** Image for the list row */
  listImage: number;
  /** Image for the intro hero */
  introImage: number;
  /** Route for the intro screen */
  introRoute: Href;
  /** Route for the session — null means "coming soon" alert on Begin */
  sessionRoute: Href | null;
};

// Copy in this file (titles, eyebrows, body paragraphs, stats, pills,
// benefit cards, quotes, footer notes) is taken verbatim from the HTML
// mocks under design/new-practices/MOVEMENT/<slug>_intro_updated/code.html
// (or the non-_intro variant when only that exists). Where the HTML did
// not show a particular field, the field is omitted rather than invented.
export const MOVEMENT_EXERCISES: MovementExercise[] = [
  {
    id: 'kundalini',
    title: 'Kundalini Spinal Flex',
    eyebrow: 'Kundalini Series',
    category: 'Flow',
    duration: '3 min',
    meta: 'Awaken spinal energy',
    moods: ['Low Energy', 'Stuck', 'Scattered'],
    body: [
      'Spinal Flex works by linking breath with rhythmic movement, which helps re-energize the body while keeping the nervous system balanced.',
      'As you move your spine forward and back with each inhale and exhale, you stimulate the flow of energy along the spine and increase circulation to the brain. This combination helps shake off mental fog, boost alertness, and create a sense of clarity—making it especially powerful when you feel stuck or low on energy.',
    ],
    stats: [
      { label: 'Breath focus', value: 'Rhythmic' },
      { label: 'Energy level', value: 'High Boost' },
    ],
    footerNote: 'Estimated duration: 11 Minutes',
    listImage: listKundaliniImg,
    introImage: kundaliniImg,
    introRoute: '/practices/body/movement/kundalini-intro',
    sessionRoute: '/practices/body/movement/kundalini-session',
  },
  {
    id: 'mindful-walking',
    title: 'Mindful Walking',
    category: 'Move',
    duration: '5 min',
    meta: 'Grounding rhythmic motion',
    moods: ['Overthinking', 'Scattered', 'Low Energy'],
    body: [
      'Mindful walking shifts your state by bringing your attention out of your thoughts and back into your body. By focusing on the sensation of each step—your feet touching the ground, your movement through space—you interrupt the mental loops that fuel stress and anxiety.',
    ],
    benefits: [
      {
        icon: 'directions-walk',
        title: 'Grounding',
        description: 'Regulate your nervous system through rhythmic contact.',
      },
      {
        icon: 'air',
        title: 'Clarity',
        description: 'Steady your breathing and reconnect to the present.',
      },
    ],
    quote:
      'Reconnect to the present moment, where things tend to feel more manageable and clear.',
    footerNote: 'Approx. 15 Minutes • Active Recovery',
    listImage: listMindfulWalkingImg,
    introImage: mindfulWalkingImg,
    introRoute: '/practices/body/movement/mindful-walking-intro',
    sessionRoute: '/practices/body/movement/mindful-walking-session',
  },
  {
    id: 'qi-gong',
    title: 'Qi Gong Shaking',
    eyebrow: 'Release & Reset',
    category: 'Movement',
    duration: '30 sec',
    meta: 'Release built-up tension in seconds',
    moods: ['Tense', 'Stuck', 'Anxious'],
    body: [
      "Shaking may seem simple, but it's one of the most natural ways the body releases stress. When animals experience danger, they instinctively shake afterward to discharge excess energy—and humans are wired the same way.",
    ],
    benefits: [
      {
        icon: 'favorite',
        title: 'Activates Circulation',
        description:
          'Gentle movement stimulates blood flow and lymphatic drainage.',
      },
      {
        icon: 'fitness-center',
        title: 'Muscle Release',
        description:
          'Loosens tight fascia and chronic tension in the shoulders and spine.',
      },
    ],
    quote:
      'Instead of storing tension, your system gets a chance to reset, leaving you feeling lighter, more relaxed, and more present.',
    listImage: listQiGongImg,
    introImage: qiGongImg,
    introRoute: '/practices/body/movement/qi-gong-intro',
    sessionRoute: '/practices/body/movement/qi-gong-session',
  },
  {
    id: 'pmr',
    title: 'Progressive Muscle',
    titleAccent: 'Relaxation',
    category: 'Movement',
    duration: '5 min',
    meta: 'Deep physical release',
    moods: ['Tense', 'Anxious'],
    body: [
      "PMR works by teaching your body the difference between tension and relaxation. When you intentionally tighten a muscle and then release it, your nervous system becomes more aware of what 'holding stress' actually feels like—and more importantly, how to let it go.",
      'This process helps reduce overall muscle tension, lowers physical stress signals, and sends calming feedback to the brain. Over time, your body learns how to relax more quickly and more deeply, even outside the exercise.',
    ],
    listImage: listPmrImg,
    introImage: pmrImg,
    introRoute: '/practices/muscle-relaxation-intro',
    sessionRoute: '/practices/muscle-relaxation-session',
  },
  {
    id: 'physiological-sigh',
    title: 'Physiological Sigh + Arm Raise',
    category: 'Breath/Move',
    duration: '2 min',
    meta: 'Reset nervous system',
    moods: ['Anxious', 'Tense', 'Stuck'],
    pills: ['3 MINS', 'STRESS RELEASE'],
    body: [
      "This technique works because it directly taps into your body's built-in calming system. The double inhale helps reopen tiny air sacs in the lungs, improving oxygen exchange, while the long exhale signals your nervous system to slow down.",
      "Pairing this with lifting and lowering your arms adds a physical release, helping your body 'complete' the stress response instead of holding onto it. In just a few breaths, your heart rate begins to settle, your muscles soften, and your brain gets the message: you're safe.",
    ],
    stats: [
      { label: 'Focus Mode', value: 'Vagus Nerve' },
      { label: 'Difficulty', value: 'Beginner' },
    ],
    footerNote: 'Prepare to lift arms as you double inhale',
    listImage: listPhysiologicalSighImg,
    introImage: physiologicalSighImg,
    introRoute: '/practices/body/movement/physiological-sigh-intro',
    sessionRoute: '/practices/body/movement/physiological-sigh-session',
  },
  {
    id: 'tai-chi',
    title: 'Tai Chi',
    titleAccent: 'Wave Hands',
    eyebrow: 'Biological Resonance',
    category: 'Flow',
    duration: '5 min',
    meta: 'Find mental stillness',
    moods: ['Overthinking', 'Scattered', 'Tense'],
    body: [
      'This slow, flowing movement helps regulate your nervous system by combining rhythm, balance, and attention.',
      'As you shift your weight and move your arms in a continuous, gentle pattern, your brain starts to sync with the movement, reducing mental noise and improving focus.',
    ],
    stats: [
      { label: 'Focus', value: 'Calm Focus' },
      { label: 'Benefit', value: 'Nervous Reset' },
    ],
    footerNote: 'Recommended for early restorative cycles',
    listImage: listTaiChiImg,
    introImage: taiChiImg,
    introRoute: '/practices/body/movement/tai-chi-intro',
    sessionRoute: '/practices/body/movement/tai-chi-session',
  },
];

export const MOVEMENT_MOODS: MovementMood[] = [
  'Anxious',
  'Overthinking',
  'Scattered',
  'Tense',
  'Low Energy',
  'Stuck',
];

export function getMovementExercise(id: string): MovementExercise | undefined {
  return MOVEMENT_EXERCISES.find((e) => e.id === id);
}
