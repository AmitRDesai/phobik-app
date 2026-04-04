import type { IconDef } from '@/modules/courage/data/courage-options';

export interface AssessmentMeta {
  id: 'intimacy' | 'pivot-point' | 'stress-compass';
  title: string;
  description: string;
  icon: IconDef;
  route: string;
}

export const ASSESSMENTS: AssessmentMeta[] = [
  {
    id: 'intimacy',
    title: 'Intimacy & Connection',
    description: 'Discover your relationship dynamics.',
    icon: { name: 'favorite' },
    route: '/practices/self-check-ins/intimacy-intro',
  },
  {
    id: 'pivot-point',
    title: 'The Pivot Point',
    description:
      'Discover how you respond under pressure\u2014and where you can shift.',
    icon: { name: 'show-chart' },
    route: '/practices/self-check-ins/pivot-point-intro',
  },
  {
    id: 'stress-compass',
    title: 'The Stress Compass',
    description: 'Discover what really matters to you.',
    icon: { family: 'ionicons', name: 'compass-outline' },
    route: '/practices/self-check-ins/stress-compass',
  },
];
