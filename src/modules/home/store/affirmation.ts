import { atomWithStorage } from 'jotai/utils';
import { storage } from '@/utils/jotai';

export const affirmationAtom = atomWithStorage<{
  feeling: string;
  text: string;
} | null>('affirmation', null, storage);

export const AFFIRMATIONS: Record<string, string[]> = {
  courage: [
    'I choose to step forward with courage and trust my inner strength',
    'Today, I embrace courage and let it guide my every step',
    'With courage in my heart, I am unstoppable',
  ],
  calm: [
    'I breathe deeply and welcome calm into every moment',
    'Today, calm flows through me like a gentle stream',
    'I am centered in calm and at peace with the present',
  ],
  confidence: [
    'I radiate confidence and believe in my abilities',
    'Today, confidence empowers me to pursue my dreams',
    'I trust myself with confidence to handle anything',
  ],
  clarity: [
    'I see my path with clarity and move forward with purpose',
    'Today, clarity illuminates every decision I make',
    'With clarity as my guide, I know exactly where I belong',
  ],
  compassion: [
    'I lead with compassion and treat myself with kindness',
    'Today, compassion opens my heart to deeper connections',
    'I embrace compassion for myself and everyone around me',
  ],
  curiosity: [
    'I approach life with curiosity and wonder',
    'Today, curiosity leads me to discover something beautiful',
    'I let curiosity guide me toward growth and understanding',
  ],
  creativity: [
    'I express my creativity freely and without judgment',
    'Today, creativity flows through me effortlessly',
    'I trust my creativity to find unique solutions',
  ],
  connection: [
    'I nurture connection with those who lift me higher',
    'Today, connection deepens my sense of belonging',
    'I am open to meaningful connection in every interaction',
  ],
};
