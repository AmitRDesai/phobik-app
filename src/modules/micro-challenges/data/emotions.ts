export interface Emotion {
  id: string;
  label: string;
  gradient: [string, string];
  shadowColor: string;
  subFeelings: string[];
}

export const EMOTIONS: Emotion[] = [
  {
    id: 'happy',
    label: 'HAPPY',
    gradient: ['#FDE047', '#EAB308'],
    shadowColor: 'rgba(234, 179, 8, 0.4)',
    subFeelings: ['Joyful', 'Radiant', 'Content'],
  },
  {
    id: 'peaceful',
    label: 'PEACEFUL',
    gradient: ['#86EFAC', '#22C55E'],
    shadowColor: 'rgba(34, 197, 94, 0.4)',
    subFeelings: ['Calm', 'Serene', 'Relaxed'],
  },
  {
    id: 'energized',
    label: 'ENERGIZED',
    gradient: ['#FDBA74', '#F97316'],
    shadowColor: 'rgba(249, 115, 22, 0.4)',
    subFeelings: ['Motivated', 'Alive', 'Excited'],
  },
  {
    id: 'loving',
    label: 'LOVING',
    gradient: ['#FDA4AF', '#F43F5E'],
    shadowColor: 'rgba(244, 63, 94, 0.4)',
    subFeelings: ['Tender', 'Warm', 'Caring'],
  },
  {
    id: 'confident',
    label: 'CONFIDENT',
    gradient: ['#93C5FD', '#3B82F6'],
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    subFeelings: ['Capable', 'Strong', 'Clear'],
  },
  {
    id: 'sad',
    label: 'SAD',
    gradient: ['#60A5FA', '#1D4ED8'],
    shadowColor: 'rgba(29, 78, 216, 0.4)',
    subFeelings: ['Lonely', 'Grieving', 'Heavy'],
  },
  {
    id: 'angry',
    label: 'ANGRY',
    gradient: ['#F87171', '#B91C1C'],
    shadowColor: 'rgba(185, 28, 28, 0.4)',
    subFeelings: ['Frustrated', 'Irritated', 'Resentful'],
  },
  {
    id: 'afraid',
    label: 'AFRAID',
    gradient: ['#D8B4FE', '#7E22CE'],
    shadowColor: 'rgba(126, 34, 206, 0.4)',
    subFeelings: ['Anxious', 'Worried', 'Panicked'],
  },
  {
    id: 'ashamed',
    label: 'ASHAMED',
    gradient: ['#94A3B8', '#475569'],
    shadowColor: 'rgba(71, 85, 105, 0.4)',
    subFeelings: ['Guilty', 'Embarrassed', 'Small'],
  },
];
