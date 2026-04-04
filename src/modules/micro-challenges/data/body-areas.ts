export interface BodyArea {
  id: string;
  label: string;
  /** Top offset as percentage of SVG container height */
  topPercent: number;
  accentColor: string;
  borderColor: string;
  bgColor: string;
}

export const BODY_AREAS: BodyArea[] = [
  {
    id: 'head',
    label: 'Head',
    topPercent: 5,
    accentColor: '#818CF8', // indigo-400
    borderColor: 'rgba(129, 140, 248, 0.3)',
    bgColor: 'rgba(129, 140, 248, 0.1)',
  },
  {
    id: 'jaw',
    label: 'Jaw',
    topPercent: 18,
    accentColor: '#22D3EE', // cyan-400
    borderColor: 'rgba(34, 211, 238, 0.3)',
    bgColor: 'rgba(34, 211, 238, 0.1)',
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    topPercent: 30,
    accentColor: '#FF6B9D', // primary pink approx
    borderColor: 'rgba(255, 107, 157, 0.3)',
    bgColor: 'rgba(255, 107, 157, 0.1)',
  },
  {
    id: 'chest',
    label: 'Chest',
    topPercent: 48,
    accentColor: '#FBBF24', // yellow-400
    borderColor: 'rgba(251, 191, 36, 0.3)',
    bgColor: 'rgba(251, 191, 36, 0.1)',
  },
  {
    id: 'stomach',
    label: 'Stomach',
    topPercent: 68,
    accentColor: '#EC5B13', // orange
    borderColor: 'rgba(236, 91, 19, 0.3)',
    bgColor: 'rgba(236, 91, 19, 0.1)',
  },
];
