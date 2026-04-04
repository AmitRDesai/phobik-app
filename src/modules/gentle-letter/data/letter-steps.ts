import { MaterialIcons } from '@expo/vector-icons';

export interface LetterStep {
  step: number;
  key: 'step1' | 'step2' | 'step3' | 'step4' | 'step5';
  label: string;
  headline: string;
  body: string;
  placeholder: string;
  tip: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const LETTER_STEPS: LetterStep[] = [
  {
    step: 1,
    key: 'step1',
    label: 'Notice What Is Here',
    headline: 'Acknowledge your feelings without judgment.',
    body: 'What is your heart feeling right now? Write it down as it is.',
    placeholder: 'I am feeling...',
    tip: 'There are no wrong answers here.',
    icon: 'spa',
  },
  {
    step: 2,
    key: 'step2',
    label: 'Name the Inner Critic',
    headline: 'Identify the harsh voice within.',
    body: 'What does your inner critic say to you? Write out the words it uses, the tone, the judgment. Bringing it into the light takes away its power.',
    placeholder: 'My inner critic tells me...',
    tip: 'Naming it is the first step to taming it.',
    icon: 'record-voice-over',
  },
  {
    step: 3,
    key: 'step3',
    label: 'Offer Understanding',
    headline: 'Reframe with compassion.',
    body: 'Now respond to those harsh words as you would to a dear friend. What would you say if someone you loved told you they felt this way?',
    placeholder: 'If a friend said this, I would tell them...',
    tip: 'You deserve the same kindness you give others.',
    icon: 'volunteer-activism',
  },
  {
    step: 4,
    key: 'step4',
    label: 'Write Your Letter',
    headline: 'Compose your gentle letter.',
    body: 'Using the compassion you just practiced, write a short letter to yourself. Begin with "Dear me," and let your heart speak.',
    placeholder: 'Dear me,\n\n',
    tip: 'Write as though you are speaking to someone you truly love.',
    icon: 'edit-note',
  },
  {
    step: 5,
    key: 'step5',
    label: 'Seal with Kindness',
    headline: 'Close with an affirmation.',
    body: 'Finish your letter with a closing affirmation \u2014 a promise, a wish, or a single kind sentence you want to carry with you.',
    placeholder: 'I want to remember that...',
    tip: 'This is your anchor of compassion.',
    icon: 'auto-awesome',
  },
];

export interface CoreAct {
  value: 'forgiveness' | 'patience' | 'acceptance' | 'kindness' | 'courage';
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const CORE_ACTS: CoreAct[] = [
  { value: 'forgiveness', label: 'Forgiveness', icon: 'healing' },
  { value: 'patience', label: 'Patience', icon: 'hourglass-top' },
  { value: 'acceptance', label: 'Acceptance', icon: 'check-circle' },
  { value: 'kindness', label: 'Kindness', icon: 'favorite' },
  { value: 'courage', label: 'Courage', icon: 'shield' },
];
