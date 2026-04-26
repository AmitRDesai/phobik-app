import type { IconDef } from '@/modules/courage/data/courage-options';

export interface AssessmentMeta {
  id: 'intimacy' | 'pivot-point' | 'stress-compass';
  title: string;
  description: string;
  icon: IconDef;
  route: string;
}

// Note: Intimacy & Connection lives under the Relationship pillar now.
// It still exists as a route at /practices/self-check-ins/intimacy-intro
// but is no longer surfaced in this hub.
export const ASSESSMENTS: AssessmentMeta[] = [
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
