export type Intention = {
  id: string;
  icon: string;
  text: string;
};

export const INTENTIONS: Intention[] = [
  {
    id: 'handle',
    icon: 'spa',
    text: 'I can handle this moment',
  },
  {
    id: 'settle',
    icon: 'air',
    text: 'My body knows how to settle',
  },
  {
    id: 'leader',
    icon: 'psychology',
    text: 'I am the leader of my internal world',
  },
  {
    id: 'enough',
    icon: 'auto-awesome',
    text: 'I am already enough, just as I am',
  },
  {
    id: 'open',
    icon: 'favorite',
    text: 'I meet this day with an open heart',
  },
];
