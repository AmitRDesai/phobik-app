import type { DoseReward } from '@/modules/courage/data/mystery-challenges';

export interface MicroChallengeResult {
  title: string;
  prompt: string;
  challengeText: string;
  dose: DoseReward;
}

const DEFAULT_CHALLENGE: MicroChallengeResult = {
  title: 'Grounded in the Present',
  prompt: 'Try this gentle regulation exercise:',
  challengeText:
    'Describe 3 solid objects in your room and their physical textures. Touch them if you can.',
  dose: { dopamine: 0, oxytocin: 5, serotonin: 5, endorphins: 0 },
};

/**
 * Maps [emotionId][needId] → personalized challenge.
 * Covers common combos; falls back to DEFAULT_CHALLENGE.
 */
const CHALLENGE_MAP: Record<string, Record<string, MicroChallengeResult>> = {
  happy: {
    connection: {
      title: 'Share the Joy',
      prompt: 'Since you\u2019re feeling happy and need connection, try this:',
      challengeText:
        'Text someone you care about and share one good thing that happened today. Notice how it feels to connect.',
      dose: { dopamine: 5, oxytocin: 10, serotonin: 0, endorphins: 0 },
    },
    meaning: {
      title: 'Anchor the Moment',
      prompt: 'Since you\u2019re feeling happy and need meaning, try this:',
      challengeText:
        'Write down what made you feel this way. Ask: how can I create more of this?',
      dose: { dopamine: 10, oxytocin: 0, serotonin: 5, endorphins: 0 },
    },
  },
  sad: {
    safety: {
      title: 'Soft Landing',
      prompt: 'Since you\u2019re feeling sad and need safety, try this:',
      challengeText:
        'Wrap yourself in a blanket. Place one hand on your heart and breathe slowly for 60 seconds.',
      dose: { dopamine: 0, oxytocin: 10, serotonin: 5, endorphins: 0 },
    },
    connection: {
      title: 'Reach Out Gently',
      prompt: 'Since you\u2019re feeling sad and need connection, try this:',
      challengeText:
        'Send a voice note to someone safe. You don\u2019t have to explain \u2014 just say hi.',
      dose: { dopamine: 0, oxytocin: 10, serotonin: 0, endorphins: 0 },
    },
  },
  angry: {
    autonomy: {
      title: 'Release the Pressure',
      prompt: 'Since you\u2019re feeling angry and need autonomy, try this:',
      challengeText:
        'Write down what you\u2019re angry about. Then write: "What I actually need right now is\u2026"',
      dose: { dopamine: 5, oxytocin: 0, serotonin: 5, endorphins: 5 },
    },
    safety: {
      title: 'Cool the Fire',
      prompt: 'Since you\u2019re feeling angry and need safety, try this:',
      challengeText:
        'Hold ice cubes in your hands for 30 seconds. Focus on the cold sensation and breathe.',
      dose: { dopamine: 0, oxytocin: 0, serotonin: 5, endorphins: 10 },
    },
  },
  afraid: {
    safety: {
      title: 'Grounded in the Present',
      prompt: 'Since you\u2019re feeling afraid and need safety, try this:',
      challengeText:
        'Describe 3 solid objects in your room and their physical textures. Touch them if you can.',
      dose: { dopamine: 0, oxytocin: 5, serotonin: 5, endorphins: 0 },
    },
    clarity: {
      title: 'Name the Fear',
      prompt: 'Since you\u2019re feeling afraid and need clarity, try this:',
      challengeText:
        'Write: "The worst that could happen is\u2026" then "I would handle it by\u2026"',
      dose: { dopamine: 5, oxytocin: 0, serotonin: 10, endorphins: 0 },
    },
  },
  ashamed: {
    honesty: {
      title: 'Compassion Reset',
      prompt: 'Since you\u2019re feeling ashamed and need honesty, try this:',
      challengeText:
        'Write the critical thought down. Then rewrite it as advice from a caring friend.',
      dose: { dopamine: 0, oxytocin: 10, serotonin: 5, endorphins: 0 },
    },
    connection: {
      title: 'Break the Isolation',
      prompt:
        'Since you\u2019re feeling ashamed and need connection, try this:',
      challengeText:
        'Share one small truth with someone you trust. Vulnerability builds bridges.',
      dose: { dopamine: 0, oxytocin: 10, serotonin: 0, endorphins: 5 },
    },
  },
  energized: {
    meaning: {
      title: 'Channel the Energy',
      prompt: 'Since you\u2019re feeling energized and need meaning, try this:',
      challengeText:
        'Pick one small task that matters to you and complete it in the next 10 minutes.',
      dose: { dopamine: 10, oxytocin: 0, serotonin: 5, endorphins: 0 },
    },
    play: {
      title: 'Ride the Wave',
      prompt: 'Since you\u2019re feeling energized and need play, try this:',
      challengeText:
        'Put on your favorite song and move your body however feels good for 3 minutes.',
      dose: { dopamine: 5, oxytocin: 0, serotonin: 0, endorphins: 10 },
    },
  },
  peaceful: {
    wellbeing: {
      title: 'Savor the Stillness',
      prompt:
        'Since you\u2019re feeling peaceful and need wellbeing, try this:',
      challengeText:
        'Close your eyes. Take 5 slow breaths and name 3 things you\u2019re grateful for right now.',
      dose: { dopamine: 5, oxytocin: 5, serotonin: 5, endorphins: 0 },
    },
  },
  loving: {
    connection: {
      title: 'Express the Love',
      prompt: 'Since you\u2019re feeling loving and need connection, try this:',
      challengeText:
        'Write a 3-sentence note of appreciation to someone who matters to you and send it.',
      dose: { dopamine: 5, oxytocin: 10, serotonin: 0, endorphins: 0 },
    },
  },
  confident: {
    autonomy: {
      title: 'Own the Moment',
      prompt:
        'Since you\u2019re feeling confident and need autonomy, try this:',
      challengeText:
        'Set one boundary today that honors your energy. Say no to one thing that drains you.',
      dose: { dopamine: 10, oxytocin: 0, serotonin: 5, endorphins: 0 },
    },
  },
};

export function getChallenge(
  emotionId: string,
  needId: string,
): MicroChallengeResult {
  return CHALLENGE_MAP[emotionId]?.[needId] ?? DEFAULT_CHALLENGE;
}
