import type { Href } from 'expo-router';

import befriendingYourFearImg from '@/assets/images/four-pillars/meditation-befriending-your-fear.jpg';
import bodyScanImg from '@/assets/images/four-pillars/meditation-body-scan.jpg';
import breathResetImg from '@/assets/images/four-pillars/meditation-breath-reset.jpg';
import futureVisualizationImg from '@/assets/images/four-pillars/meditation-future-visualization.jpg';
import lettingGoImg from '@/assets/images/four-pillars/meditation-letting-go.jpg';
import lovingKindnessImg from '@/assets/images/four-pillars/meditation-loving-kindness.jpg';
import presentMomentResetImg from '@/assets/images/four-pillars/meditation-present-moment-reset.jpg';
import yogaNidraImg from '@/assets/images/four-pillars/meditation-yoga-nidra.jpg';

import listBefriendingYourFearImg from '@/assets/images/four-pillars/meditation-list-befriending-your-fear.jpg';
import listBodyScanImg from '@/assets/images/four-pillars/meditation-list-body-scan.jpg';
import listBreathResetImg from '@/assets/images/four-pillars/meditation-list-breath-reset.jpg';
import listFutureVisualizationImg from '@/assets/images/four-pillars/meditation-list-future-visualization.jpg';
import listLettingGoImg from '@/assets/images/four-pillars/meditation-list-letting-go.jpg';
import listLovingKindnessImg from '@/assets/images/four-pillars/meditation-list-loving-kindness.jpg';
import listPresentMomentResetImg from '@/assets/images/four-pillars/meditation-list-present-moment-reset.jpg';
import listYogaNidraImg from '@/assets/images/four-pillars/meditation-list-yoga-nidra.jpg';

export type Meditation = {
  id: string;
  title: string;
  /** One-line description shown in the library list */
  shortDescription: string;
  /** Body paragraph(s) — verbatim from each meditation's design HTML */
  body: string[];
  /** Optional eyebrow pill — verbatim from HTML when present */
  eyebrow?: string;
  /** Optional sub-meta line under the title — verbatim from HTML when present */
  meta?: string;
  /** Display duration */
  duration: string;
  /**
   * Optional stat cards. Set `live` to bind a card to a live source — the
   * screen replaces `value` with the current sample.
   *  - `heart_rate` / `hrv`: from connected wearable
   *  - `duration`: total length of the loaded audio file
   *  - `remaining`: countdown derived from audio playback position
   *  - `elapsed`: time-into-session from audio playback position
   */
  stats?: {
    label: string;
    value: string;
    live?: 'heart_rate' | 'hrv' | 'duration' | 'remaining' | 'elapsed';
  }[];
  listImage: number;
  introImage: number;
  route: Href;
  /**
   * If set, the meditation has guided audio. The actual audio key resolves
   * at runtime as `${audioBaseKey}-${voice}` (e.g. "body-scan-female").
   * Omit for meditations that don't yet have a recording.
   */
  audioBaseKey?: string;
};

// All copy in this file (titles, eyebrows, meta, body paragraphs, stat
// labels and values) is taken verbatim from the HTML mocks under
// design/new-practices/MODITATIONS/<slug>/code.html. Where the HTML did
// not show a particular field (e.g. some meditations have no stats), the
// field is omitted rather than invented.
export const MEDITATIONS: Meditation[] = [
  {
    id: 'yoga-nidra',
    title: 'Yoga Nidra',
    eyebrow: 'Restorative Brain Wave Sync',
    shortDescription:
      'Enter a state of deep rest where your body resets and your mind stays gently aware.',
    body: [
      "Yoga Nidra guides your body into a state of deep rest while your mind remains gently aware. This practice has been shown to reduce stress, improve sleep quality, and support nervous system recovery by shifting brain activity into slower, restorative states. It's especially helpful when you feel exhausted, burned out, or unable to fully relax.",
    ],
    duration: '30 min',
    stats: [
      { label: 'Duration', value: '—', live: 'duration' },
      { label: 'Remaining', value: '—', live: 'remaining' },
    ],
    listImage: listYogaNidraImg,
    introImage: yogaNidraImg,
    route: '/meditations/yoga-nidra',
    audioBaseKey: 'yoga-nidra',
  },
  {
    id: 'breath-reset',
    title: 'Breath Reset',
    eyebrow: 'Session Active',
    shortDescription:
      'Follow your breath to steady your mind and calm your body.',
    body: [
      "Focusing on your breath is one of the fastest ways to calm your nervous system. Slow, steady breathing activates your body's parasympathetic response, which helps reduce stress, lower heart rate, and quiet mental noise. This practice is especially helpful when you feel anxious or overwhelmed, giving your mind something steady to return to while your body settles.",
    ],
    duration: '12 min',
    stats: [
      { label: 'Remaining', value: '—', live: 'remaining' },
      { label: 'Synced BPM', value: '—', live: 'heart_rate' },
    ],
    listImage: listBreathResetImg,
    introImage: breathResetImg,
    route: '/meditations/breath-reset',
    audioBaseKey: 'breath-reset',
  },
  {
    id: 'body-scan',
    title: 'Body Scan',
    eyebrow: 'Active Session',
    shortDescription:
      'Bring awareness into your body and gently release tension.',
    body: [
      'A body scan shifts your attention out of your thoughts and into physical sensation, helping reduce mental overactivity and release stored tension.',
      'Research shows that increasing body awareness can lower stress and improve emotional regulation. This meditation is ideal when you feel tense, disconnected, or stuck in your head, helping you come back into your body.',
    ],
    duration: '24 min',
    stats: [
      { label: 'Remaining', value: '—', live: 'remaining' },
      { label: 'Heart Rate', value: '— BPM', live: 'heart_rate' },
    ],
    listImage: listBodyScanImg,
    introImage: bodyScanImg,
    route: '/meditations/body-scan',
    audioBaseKey: 'body-scan',
  },
  {
    id: 'befriending-your-fear',
    title: 'Befriending Your Fear',
    eyebrow: 'Current Session',
    shortDescription:
      'Step back from your thoughts and let them pass without getting pulled in.',
    body: [
      'This practice helps you step back and observe your thoughts instead of getting caught up in them. By labeling thoughts as they arise, you create space between you and your mental patterns, reducing rumination and reactivity.',
      "It's especially effective when your mind is looping or overanalyzing, helping you regain clarity and perspective.",
    ],
    duration: '15 min',
    stats: [
      { label: 'Duration', value: '—', live: 'duration' },
      { label: 'Remaining', value: '—', live: 'remaining' },
    ],
    listImage: listBefriendingYourFearImg,
    introImage: befriendingYourFearImg,
    route: '/meditations/befriending-your-fear',
    audioBaseKey: 'befriending-your-fear',
  },
  {
    id: 'letting-go',
    title: 'Letting Go',
    eyebrow: 'Internal Release Protocol',
    shortDescription:
      "Release what you're holding and allow your system to reset.",
    body: [
      "This meditation helps your body release built-up stress by guiding you to notice tension and soften it. By pairing awareness with intentional release, you reduce physical and emotional holding patterns. It's particularly useful when you feel weighed down, tense, or emotionally overloaded, allowing your system to reset and lighten.",
    ],
    duration: '18 min',
    listImage: listLettingGoImg,
    introImage: lettingGoImg,
    route: '/meditations/letting-go',
  },
  {
    id: 'loving-kindness',
    title: 'Loving Kindness',
    eyebrow: 'Emotional Flow',
    meta: 'Guided Practice • 12 Mins',
    shortDescription:
      'Reconnect with warmth, compassion, and a sense of connection.',
    body: [
      'Loving-kindness meditation strengthens feelings of connection, warmth, and emotional resilience. Studies show it can increase positive emotions and reduce stress by activating areas of the brain linked to empathy and bonding. This practice is powerful when you feel disconnected, lonely, or frustrated, helping you reconnect with yourself and others.',
    ],
    duration: '12 min',
    stats: [
      { label: 'Duration', value: '—', live: 'duration' },
      { label: 'Remaining', value: '—', live: 'remaining' },
    ],
    listImage: listLovingKindnessImg,
    introImage: lovingKindnessImg,
    route: '/meditations/loving-kindness',
    audioBaseKey: 'loving-kindness',
  },
  {
    id: 'present-moment-reset',
    title: 'Present Moment Reset',
    meta: 'Developing Relationship with Your Mind and Body',
    shortDescription:
      "Ground yourself quickly by returning to what's here right now.",
    body: [
      "This quick grounding practice brings your attention back to what's happening right now, interrupting stress and anxiety loops. By engaging your senses and awareness, you signal to your brain that you are safe in the present moment. It's ideal for immediate relief when you feel overwhelmed or need a fast reset during the day.",
    ],
    duration: '10 min',
    listImage: listPresentMomentResetImg,
    introImage: presentMomentResetImg,
    route: '/meditations/present-moment-reset',
  },
  {
    id: 'future-visualization',
    title: 'Future Visualization',
    eyebrow: 'Active Session',
    shortDescription:
      'Step into the version of you that feels calm, capable, and in control.',
    body: [
      'Visualization activates many of the same neural pathways as real experience, helping your brain rehearse calm, confident behavior. By imagining your future self in a grounded and capable state, you reinforce positive patterns and reduce fear-based thinking. This is especially useful when you feel stuck, uncertain, or need motivation.',
    ],
    duration: '12 min',
    stats: [
      { label: 'Duration', value: '—', live: 'duration' },
      { label: 'Remaining', value: '—', live: 'remaining' },
    ],
    listImage: listFutureVisualizationImg,
    introImage: futureVisualizationImg,
    route: '/meditations/future-visualization',
    audioBaseKey: 'future-visualization',
  },
];

export function getMeditation(id: string): Meditation | undefined {
  return MEDITATIONS.find((m) => m.id === id);
}
