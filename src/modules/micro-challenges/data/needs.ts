export interface Need {
  id: string;
  label: string;
  gradient: [string, string];
  shadowColor: string;
  subNeeds: string[];
}

export const NEEDS: Need[] = [
  {
    id: 'connection',
    label: 'CONNECTION',
    gradient: ['#FDE047', '#EAB308'],
    shadowColor: 'rgba(234, 179, 8, 0.4)',
    subNeeds: ['Empathy', 'Trust', 'Clarity'],
  },
  {
    id: 'wellbeing',
    label: 'WELLBEING',
    gradient: ['#86EFAC', '#22C55E'],
    shadowColor: 'rgba(34, 197, 94, 0.4)',
    subNeeds: ['Rest', 'Nourishment', 'Movement'],
  },
  {
    id: 'safety',
    label: 'SAFETY',
    gradient: ['#FDBA74', '#F97316'],
    shadowColor: 'rgba(249, 115, 22, 0.4)',
    subNeeds: ['Stability', 'Predictability', 'Shelter'],
  },
  {
    id: 'autonomy',
    label: 'AUTONOMY',
    gradient: ['#60A5FA', '#1D4ED8'],
    shadowColor: 'rgba(29, 78, 216, 0.4)',
    subNeeds: ['Freedom', 'Choice', 'Independence'],
  },
  {
    id: 'meaning',
    label: 'MEANING',
    gradient: ['#F87171', '#B91C1C'],
    shadowColor: 'rgba(185, 28, 28, 0.4)',
    subNeeds: ['Purpose', 'Contribution', 'Growth'],
  },
  {
    id: 'honesty',
    label: 'HONESTY',
    gradient: ['#D8B4FE', '#7E22CE'],
    shadowColor: 'rgba(126, 34, 206, 0.4)',
    subNeeds: ['Authenticity', 'Integrity', 'Transparency'],
  },
  {
    id: 'play',
    label: 'PLAY / JOY',
    gradient: ['#FDA4AF', '#F43F5E'],
    shadowColor: 'rgba(244, 63, 94, 0.4)',
    subNeeds: ['Fun', 'Creativity', 'Laughter'],
  },
  {
    id: 'clarity',
    label: 'CLARITY',
    gradient: ['#93C5FD', '#3B82F6'],
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    subNeeds: ['Understanding', 'Direction', 'Focus'],
  },
];
