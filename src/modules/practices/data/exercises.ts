import { Exercise } from '../types';

export const EXERCISES: Exercise[] = [
  {
    id: 'grounding-54321',
    name: '5-4-3-2-1 Grounding',
    duration: '2 MIN',
    icon: 'grid-view',
    iconColor: 'pink',
    anxietyLevels: ['severe', 'moderate', 'mild', 'calm'],
    description:
      'The 5-4-3-2-1 mindfulness technique grounds you in the present by naming 5 things you see, 4 things you feel, 3 things you hear, 2 things you smell and 1 thing you taste. It\u2019s a simple, sensory-based method to reduce anxiety and refocus your mind.',
    steps: [
      {
        count: 5,
        title: 'See',
        subtitle: 'Acknowledge five things you see around you.',
      },
      {
        count: 4,
        title: 'Feel',
        subtitle: 'Acknowledge four things you can feel.',
      },
      {
        count: 3,
        title: 'Hear',
        subtitle: 'Acknowledge three things you can hear.',
      },
      {
        count: 2,
        title: 'Smell',
        subtitle: 'Acknowledge two things you can smell.',
      },
      {
        count: 1,
        title: 'Taste',
        subtitle: 'Acknowledge one thing you can taste.',
      },
    ],
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    duration: '2 MIN',
    icon: 'crop-square',
    iconColor: 'accent',
    anxietyLevels: ['moderate', 'mild', 'calm'],
    description:
      'Box breathing is a calming technique that involves inhaling, holding, exhaling, and holding again \u2014 each for 4 seconds. Repeating this cycle helps reduce stress, improve focus, and regulate the nervous system.',
  },
  {
    id: 'star-breathing',
    name: 'Star Breathing',
    duration: '2 MIN',
    icon: 'star',
    iconColor: 'pink',
    anxietyLevels: ['mild', 'calm'],
    description:
      'Star Breathing is a calming technique where you trace a five-pointed star, inhaling and exhaling along each side. Each point guides your breath helping you slow down and reduce stress.',
  },
  {
    id: '478-breathing',
    name: '4-7-8 Breathing',
    duration: '2 MIN',
    icon: 'air',
    iconColor: 'accent',
    anxietyLevels: ['severe', 'moderate'],
    description:
      'The 4-7-8 breathing technique involves inhaling for 4 seconds, holding the breath for 7 seconds, and exhaling for 8 seconds. It promotes relaxation, calms the mind, and can help reduce anxiety and improve sleep.',
  },
  {
    id: 'double-inhale',
    name: 'Double Inhale',
    duration: '1 MIN',
    icon: 'air',
    iconColor: 'pink',
    anxietyLevels: ['severe', 'moderate', 'mild'],
    description:
      'Double inhale breathing consists of two quick, deep breaths in through the nose, followed by a single strong exhale through the mouth. This energizing technique helps clear the lungs, boost alertness, and can be repeated for 3 to 5 cycles.',
  },
  {
    id: 'lazy-8-breathing',
    name: 'Lazy 8 Breathing',
    duration: '2 MIN',
    icon: 'all-inclusive',
    iconColor: 'accent',
    anxietyLevels: ['mild', 'calm'],
    description:
      'Lazy 8 breathing is a calming technique where you slowly trace a sideways figure eight with your eyes or finger, inhaling on one loop and exhaling on the other, promoting relaxation, focus, and balanced breathing.',
  },
  {
    id: 'muscle-relaxation',
    name: 'Muscle Relaxation',
    duration: '4 MIN',
    icon: 'accessibility-new',
    iconColor: 'pink',
    anxietyLevels: ['severe', 'moderate'],
    description:
      'Progressive muscle relaxation (PMR) involves tensing and then slowly relaxing different muscle groups in the body. This technique helps release physical tension, calm the nervous system, and reduce stress by increasing awareness of how your body holds and releases tension.',
  },
  {
    id: 'sleep-meditation',
    name: 'Sleep Meditation',
    duration: '15 MIN',
    icon: 'bedtime',
    iconColor: 'accent',
    anxietyLevels: ['moderate', 'calm'],
    description:
      "A guided meditation designed to help you drift into deep, restful sleep. Follow the soothing narration as it guides you through relaxation techniques, releasing tension and calming your mind for a peaceful night's rest.",
  },
];
