export type EFTPointEntry = {
  number: string;
  accent: 'primary' | 'secondary';
  strong: boolean;
  title: string;
  meridian: string;
  description: string;
};

export const EFT_POINTS: EFTPointEntry[] = [
  {
    number: '01',
    accent: 'primary',
    strong: true,
    title: 'Side of Hand point (SH/Karate Chop)',
    meridian: 'Small Intestine meridian, fleshy part of outer hand',
    description:
      'Used for the initial setup statement to address psychological reversal.',
  },
  {
    number: '02',
    accent: 'primary',
    strong: false,
    title: 'Eyebrow point (EB)',
    meridian: 'Bladder meridian, start of the eyebrow near the nose',
    description: 'Helps release tension and negative emotions.',
  },
  {
    number: '03',
    accent: 'primary',
    strong: false,
    title: 'Side of Eye Point (SE)',
    meridian: 'Gall Bladder meridian, outer corner of the eye (on the bone)',
    description: 'Encourages clarity and decision-making.',
  },
  {
    number: '04',
    accent: 'primary',
    strong: false,
    title: 'Under Eye point (UE)',
    meridian: 'Stomach meridian, below the eye in line with the pupil',
    description: 'Eases worry and overwhelm.',
  },
  {
    number: '05',
    accent: 'secondary',
    strong: true,
    title: 'Under Nose point (UN)',
    meridian: 'Governing vessel, between the nose and upper lip',
    description: 'Helps process vulnerability, shame and discomfort.',
  },
  {
    number: '06',
    accent: 'secondary',
    strong: false,
    title: 'Chin point (CH)',
    meridian: 'Conception vessel, between the lower lip and chin',
    description: 'Builds confidence and emotional stability.',
  },
  {
    number: '07',
    accent: 'primary',
    strong: true,
    title: 'Collarbone point (CB)',
    meridian: 'Kidney meridian, just below the collarbone near the center',
    description: 'Calms fear and anxious energy.',
  },
  {
    number: '08',
    accent: 'secondary',
    strong: true,
    title: 'Under Arm point (UA)',
    meridian: 'Spleen meridian, side of the body, a few inches below armpit',
    description: 'Supports stress release and relaxation.',
  },
  {
    number: '09',
    accent: 'primary',
    strong: true,
    title: 'Top of Head point (TOH)',
    meridian: 'Governing vessel, crown of the head',
    description: 'Supports overall balance and energy flow.',
  },
];
