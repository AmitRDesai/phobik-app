import type { Href } from 'expo-router';

import box478Img from '@/assets/images/four-pillars/breathe-478.jpg';
import boxImg from '@/assets/images/four-pillars/breathe-box.jpg';
import doubleInhaleImg from '@/assets/images/four-pillars/breathe-double-inhale.jpg';
import groundingImg from '@/assets/images/four-pillars/breathe-grounding-54321.jpg';
import lazy8Img from '@/assets/images/four-pillars/breathe-lazy-8.jpg';
import starImg from '@/assets/images/four-pillars/breathe-star.jpg';

export type AnxietyLevel = 'Severe' | 'Moderate' | 'Mild' | 'Calm';

export type BreatheExercise = {
  id: string;
  title: string;
  category: string;
  duration: string;
  meta: string;
  /** Anxiety levels this exercise is recommended for (filter) */
  levels: AnxietyLevel[];
  /** Existing intro route in the app — not redesigned in this scope. */
  introRoute: Href;
  image: number;
};

export const BREATHE_EXERCISES: BreatheExercise[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    category: 'Breath',
    duration: '4 min',
    meta: 'Equal-count breathing for steady focus',
    levels: ['Moderate', 'Mild', 'Calm'],
    introRoute: '/practices/box-breathing-intro',
    image: boxImg,
  },
  {
    id: 'breathing-478',
    title: '4-7-8 Breathing',
    category: 'Breath',
    duration: '4 min',
    meta: 'Long exhales to settle the body',
    levels: ['Severe', 'Moderate'],
    introRoute: '/practices/478-breathing-intro',
    image: box478Img,
  },
  {
    id: 'star-breathing',
    title: 'Star Breathing',
    category: 'Breath',
    duration: '3 min',
    meta: 'Trace a star to anchor your breath',
    levels: ['Mild', 'Calm'],
    introRoute: '/practices/star-breathing-intro',
    image: starImg,
  },
  {
    id: 'lazy-8',
    title: 'Lazy 8 Breathing',
    category: 'Breath',
    duration: '3 min',
    meta: 'Smooth infinity loop for calm',
    levels: ['Mild', 'Calm'],
    introRoute: '/practices/lazy-8-breathing-intro',
    image: lazy8Img,
  },
  {
    id: 'double-inhale',
    title: 'Double Inhale',
    category: 'Breath',
    duration: '2 min',
    meta: 'Quick reset for stress spikes',
    levels: ['Severe', 'Moderate', 'Mild'],
    introRoute: '/practices/double-inhale-intro',
    image: doubleInhaleImg,
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Grounding',
    category: 'Senses',
    duration: '3 min',
    meta: 'Engage your senses to come back',
    levels: ['Severe', 'Moderate', 'Mild', 'Calm'],
    introRoute: '/practices/grounding-intro',
    image: groundingImg,
  },
];

export const BREATHE_LEVEL_FILTERS = [
  'All',
  'Severe',
  'Moderate',
  'Mild',
  'Calm',
] as const;
export type BreatheLevelFilter = (typeof BREATHE_LEVEL_FILTERS)[number];
