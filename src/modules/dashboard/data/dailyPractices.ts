import physiologicalSigh from '@/assets/images/four-pillars/movement-list-physiological-sigh.jpg';
import qiGong from '@/assets/images/four-pillars/movement-list-qi-gong.jpg';
import taiChi from '@/assets/images/four-pillars/movement-list-tai-chi.jpg';
import type { Href } from 'expo-router';
import type { ImageSourcePropType } from 'react-native';

export interface DailyPractice {
  id: string;
  title: string;
  durationLabel: string;
  category: string;
  image: ImageSourcePropType;
  route: Href;
}

export const DAILY_PRACTICES: DailyPractice[] = [
  {
    id: 'physiological-sigh',
    title: 'Physiological Sigh',
    durationLabel: '3 MIN',
    category: 'Breathwork',
    image: physiologicalSigh,
    route: '/breathe',
  },
  {
    id: 'qi-gong-shaking',
    title: 'Qi Gong Shaking',
    durationLabel: '5 MIN',
    category: 'Movement',
    image: qiGong,
    route: '/movements',
  },
  {
    id: 'tai-chi-hands',
    title: 'Tai Chi Hands',
    durationLabel: '8 MIN',
    category: 'Meditation',
    image: taiChi,
    route: '/meditations',
  },
];
