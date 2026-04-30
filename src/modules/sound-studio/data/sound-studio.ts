import type { Href } from 'expo-router';

import curatedBody from '@/assets/images/sound-studio/curated-body.jpg';
import curatedConnection from '@/assets/images/sound-studio/curated-connection.jpg';
import curatedEmotion from '@/assets/images/sound-studio/curated-emotion.jpg';
import curatedMind from '@/assets/images/sound-studio/curated-mind.jpg';
import nowPlayingImg from '@/assets/images/sound-studio/now-playing.jpg';

export type SoundscapeCategory = {
  id: 'body' | 'mind' | 'emotion' | 'connection';
  title: string;
  subtitle: string;
  meta: string;
  image: number;
  route: Href;
};

export const SOUNDSCAPE_CATEGORIES: SoundscapeCategory[] = [
  {
    id: 'body',
    title: 'BODY',
    subtitle: 'Curated soundscapes designed to align your physiological state.',
    meta: 'Goal: Align breath, heart rate, motion',
    image: curatedBody,
    route: '/practices/emotion/sound-studio/curated/body',
  },
  {
    id: 'mind',
    title: 'MIND',
    subtitle: 'Soundscapes that quiet mental loops and improve clarity.',
    meta: 'Goal: Quieten cognitive chatter',
    image: curatedMind,
    route: '/practices/emotion/sound-studio/curated/mind',
  },
  {
    id: 'emotion',
    title: 'EMOTION',
    subtitle: 'Tonal palettes to gently process difficult emotional textures.',
    meta: 'Goal: Settle emotional intensity',
    image: curatedEmotion,
    route: '/practices/emotion/sound-studio/curated/emotion',
  },
  {
    id: 'connection',
    title: 'CONNECTION',
    subtitle: 'Warm, relational sound fields for safety and attuned presence.',
    meta: 'Goal: Cultivate safety + connection',
    image: curatedConnection,
    route: '/practices/emotion/sound-studio/curated/connection',
  },
];

export type EmotionalTag =
  | 'Ethereal'
  | 'Vibrant'
  | 'Melancholy'
  | 'Aggressive'
  | 'Nostalgic'
  | 'Cinematic'
  | 'Hypnotic'
  | 'Euphoric'
  | 'Industrial'
  | 'Dreamy';

export const EMOTIONAL_TAGS: EmotionalTag[] = [
  'Ethereal',
  'Vibrant',
  'Melancholy',
  'Aggressive',
  'Nostalgic',
  'Cinematic',
  'Hypnotic',
  'Euphoric',
  'Industrial',
  'Dreamy',
];

export type CreditPlan = {
  id: string;
  name: string;
  credits: number;
  price: string;
  popular?: boolean;
  tagline?: string;
};

export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: '$9.99',
    tagline: 'Perfect for quick sonic experiments.',
  },
  {
    id: 'pro',
    name: 'Pro Studio',
    credits: 50,
    price: '$39.99',
    popular: true,
    tagline:
      'Best value for frequent creators. Priority generation and advanced tuning tools.',
  },
  {
    id: 'unlimited',
    name: 'Unlimited Flow',
    credits: 250,
    price: '$149.99',
    tagline: 'Total creative freedom. Access to premium AI models and stems.',
  },
];

export const NOW_PLAYING_IMAGE = nowPlayingImg;
