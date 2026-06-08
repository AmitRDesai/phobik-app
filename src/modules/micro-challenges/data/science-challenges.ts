/**
 * Phobik science-backed micro challenges — a flat, rotating library of short,
 * research-grounded nervous-system practices. Surfaced as the home "Daily
 * Challenge" and inside the Daily Flow. Independent of the legacy DOSE map in
 * {@link ./challenges.ts}.
 */
export interface ScienceChallenge {
  id: string;
  title: string;
  /** Short human label, e.g. "30 sec", "2 min", "Bedtime". */
  durationLabel: string;
  /** Approx. seconds for any timed UI (0 = untimed / contextual). */
  durationSeconds: number;
  whatToDo: string;
  whyItWorks: string;
}

export const SCIENCE_CHALLENGES: ScienceChallenge[] = [
  {
    id: 'calming-hum',
    title: 'The Calming Hum',
    durationLabel: '30 sec',
    durationSeconds: 30,
    whatToDo:
      'Take a slow breath in and hum softly as you exhale for 30 seconds.',
    whyItWorks:
      'The vibration created during humming stimulates areas around the throat, vocal cords, and facial muscles that are connected to the vagus nerve — the primary nerve involved in the body’s relaxation response. Research suggests vagal stimulation may help support emotional regulation, slower breathing, and a greater sense of calm.',
  },
  {
    id: 'slow-motion-reset',
    title: 'The Slow Motion Reset',
    durationLabel: '60 sec',
    durationSeconds: 60,
    whatToDo:
      'Choose one simple activity — walking, drinking water, or washing your hands — and perform it at half your normal speed for 60 seconds.',
    whyItWorks:
      'Slowing down movement increases interoceptive awareness, your ability to notice internal sensations. Research shows that increased body awareness can reduce automatic stress reactions and help shift the brain out of survival mode and back into the present moment.',
  },
  {
    id: 'light-recharge',
    title: 'The Light Recharge',
    durationLabel: '2 min',
    durationSeconds: 120,
    whatToDo:
      'Spend 2 minutes outside in natural daylight shortly after waking. Face toward the brightest part of the sky without looking directly at the sun.',
    whyItWorks:
      'Morning light is one of the strongest signals for regulating your circadian rhythm. Studies show natural light exposure influences cortisol timing, melatonin production, alertness, mood, and sleep quality. Even a few minutes can help synchronize your body’s internal clock.',
  },
  {
    id: 'heart-appreciation-pause',
    title: 'The Heart Appreciation Pause',
    durationLabel: '20 sec',
    durationSeconds: 20,
    whatToDo:
      'Place a hand on your heart and bring to mind a person, memory, or experience you genuinely appreciate. Hold that feeling for at least 20 seconds.',
    whyItWorks:
      'Research from the HeartMath Institute and other psychophysiology studies suggests that feelings of appreciation and gratitude may improve heart rate variability (HRV), a marker associated with resilience, emotional regulation, and nervous system flexibility.',
  },
  {
    id: '90-second-feel-through',
    title: 'The 90-Second Feel Through',
    durationLabel: '90 sec',
    durationSeconds: 90,
    whatToDo:
      'When a difficult emotion arises, set a timer for 90 seconds. Focus on the physical sensations of the emotion rather than the story surrounding it.',
    whyItWorks:
      'Neuroscientist Dr. Jill Bolte Taylor popularized the idea that the physiological lifespan of an emotion is relatively short unless it is continually reinforced through thinking and rumination. Observing sensations without feeding the thought loop can help emotions move through the body more naturally.',
  },
  {
    id: 'sleep-insight-prompt',
    title: 'The Sleep Insight Prompt',
    durationLabel: 'Bedtime',
    durationSeconds: 0,
    whatToDo:
      'Before falling asleep, quietly ask yourself: “What would be helpful for me to understand right now?” Then allow yourself to rest.',
    whyItWorks:
      'During sleep, particularly REM sleep, the brain actively processes memories, emotions, and experiences. Sleep research shows that emotional learning, memory consolidation, and problem-solving continue long after conscious thinking has stopped.',
  },
  {
    id: 'best-self-replay',
    title: 'The Best-Self Replay',
    durationLabel: 'Bedtime',
    durationSeconds: 60,
    whatToDo:
      'During your final minute before sleep, replay a moment from today when you acted with courage, confidence, kindness, or integrity. Experience the memory as vividly as possible.',
    whyItWorks:
      'The brain strengthens neural pathways that receive repeated attention. Neuroscience research on memory consolidation suggests that experiences reviewed before sleep are more likely to be reinforced and integrated into long-term memory networks.',
  },
  {
    id: 'future-self-decision',
    title: 'The Future-Self Decision',
    durationLabel: 'Anytime',
    durationSeconds: 0,
    whatToDo:
      'Give your future self a name, image, or feeling. The next time you’re faced with a decision, ask: “What would my future self choose right now?”',
    whyItWorks:
      'Research in behavioral psychology and identity-based habit formation suggests that people make more consistent decisions when choices are connected to identity rather than motivation alone. Future-self thinking has also been associated with improved self-control and long-term decision making.',
  },
];

/** Deterministic "challenge of the day" — rotates by day-of-year, no RNG. */
export function challengeForDay(dayIndex: number): ScienceChallenge {
  return SCIENCE_CHALLENGES[dayIndex % SCIENCE_CHALLENGES.length];
}
