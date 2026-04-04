export interface SensationAttribute {
  id: string;
  category: string;
  question: string;
  optionA: string;
  optionB: string;
}

export const SENSATION_ATTRIBUTES: SensationAttribute[] = [
  {
    id: 'density',
    category: 'Density',
    question: 'Tight or loose?',
    optionA: 'Tight',
    optionB: 'Loose',
  },
  {
    id: 'weight',
    category: 'Weight',
    question: 'Heavy or light?',
    optionA: 'Heavy',
    optionB: 'Light',
  },
  {
    id: 'thermal',
    category: 'Thermal',
    question: 'Warm or cool?',
    optionA: 'Warm',
    optionB: 'Cool',
  },
  {
    id: 'presence',
    category: 'Presence',
    question: 'Numb or neutral?',
    optionA: 'Numb',
    optionB: 'Neutral',
  },
];
