import { PracticeCategory } from '../types';

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  {
    id: 'calm',
    category: 'ANXIETY REDUCTION',
    duration: '3-5 MINS',
    title: 'Calm',
    description: 'Breathing & grounding to find your center.',
    benefit: 'Lowers Heart Rate',
    benefitIcon: 'trending-down',
    thumbnailIcon: 'air',
  },
  {
    id: 'courage',
    category: 'STRENGTH',
    duration: '5-8 MINS',
    title: 'Courage',
    description: 'Tools to face challenges and overcome fear.',
    benefit: 'Regulates Stress',
    benefitIcon: 'analytics',
    thumbnailIcon: 'bolt',
  },
  {
    id: 'love',
    category: 'CONNECTION',
    duration: '5-10 MINS',
    title: 'Love',
    description: 'Self-compassion and relationship tools.',
    benefit: 'Heart Opening',
    benefitIcon: 'monitor-heart',
    thumbnailIcon: 'favorite',
  },
  {
    id: 'journal',
    category: 'REFLECTION',
    duration: '2-4 MINS',
    title: 'Journal',
    description: 'Reflections and cognitive loop interruption.',
    benefit: 'Interrupts Loops',
    benefitIcon: 'psychology',
    thumbnailIcon: 'auto-stories',
  },
];
