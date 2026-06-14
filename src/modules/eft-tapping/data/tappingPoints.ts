export type Dot = { x: number; y: number };

export type TappingPoint = {
  id: string;
  name: string;
  description: string;
  benefit: string;
  dots: Dot[];
  zoom: number;
  focalX: number;
  focalY: number;
  phaseLabel: string;
  dotShape: 'ellipse' | 'circle';
};

export const TAPPING_POINTS: TappingPoint[] = [
  {
    id: 'side-of-hand',
    name: 'Side of Hand',
    description:
      'Midway between base of pinky and wrist crease on the fleshy side',
    benefit: 'Helps release deep-seated resistance',
    dots: [
      { x: 21, y: 73 },
      { x: 81, y: 73 },
    ],
    zoom: 2.8,
    focalX: 20,
    focalY: 74,
    phaseLabel: 'Phase 1: Side of Hand',
    dotShape: 'ellipse',
  },
  {
    id: 'eyebrow',
    name: 'Eyebrow (EB)',
    description:
      'Inner edge of eyebrow, directly above the inner corner of eye',
    benefit: 'Helps release tension and negative emotions',
    dots: [
      { x: 49.2, y: 28.5 },
      { x: 51.5, y: 28.5 },
    ],
    zoom: 3.2,
    focalX: 50,
    focalY: 28.5,
    phaseLabel: 'Phase 2: Eyebrow',
    dotShape: 'circle',
  },
  {
    id: 'side-of-eye',
    name: 'Side of Eye (SE)',
    description: 'On the bone bordering the outside corner of the eye',
    benefit: 'Helps release frustration and anger',
    dots: [
      { x: 45, y: 29.2 },
      { x: 55, y: 29.2 },
    ],
    zoom: 3.5,
    focalX: 50,
    focalY: 30,
    phaseLabel: 'Phase 3: Side of Eye',
    dotShape: 'circle',
  },
  {
    id: 'under-the-eye',
    name: 'Under Eye (UE)',
    description: 'On the bone directly under the eye, centered with the pupil',
    benefit: 'Helps release fear and anxiety',
    dots: [
      { x: 47.5, y: 30.5 },
      { x: 52.5, y: 30.5 },
    ],
    zoom: 3,
    focalX: 50,
    focalY: 30.5,
    phaseLabel: 'Phase 4: Under Eye',
    dotShape: 'circle',
  },
  {
    id: 'under-the-nose',
    name: 'Under Nose (UN)',
    description: 'On the philtrum, between the bottom of the nose and top lip',
    benefit: 'Helps release shame and reversals',
    dots: [{ x: 50, y: 32.8 }],
    zoom: 3,
    focalX: 50,
    focalY: 32.8,
    phaseLabel: 'Phase 5: Under Nose',
    dotShape: 'circle',
  },
  {
    id: 'chin',
    name: 'Chin (CH)',
    description: 'In the indentation between the lower lip and the chin',
    benefit: 'Helps release confusion and uncertainty',
    dots: [{ x: 50, y: 35.8 }],
    zoom: 3,
    focalX: 50,
    focalY: 35.8,
    phaseLabel: 'Phase 6: Chin',
    dotShape: 'circle',
  },
  {
    id: 'collarbone',
    name: 'Collarbone (CB)',
    description: 'Just below the collarbone, where it meets the breastbone',
    benefit: 'Helps release stress and feel more grounded',
    dots: [
      { x: 45, y: 43.0 },
      { x: 55, y: 43.0 },
    ],
    zoom: 3.5,
    focalX: 50,
    focalY: 43.0,
    phaseLabel: 'Phase 7: Collarbone',
    dotShape: 'circle',
  },
  {
    id: 'under-the-arm',
    name: 'Under Arm (UA)',
    description: 'On the side of the body, about 4 inches below the armpit',
    benefit: 'Helps release anxiety and guilt',
    dots: [
      { x: 40.5, y: 58.5 },
      { x: 59.5, y: 58.5 },
    ],
    zoom: 2.2,
    focalX: 50,
    focalY: 58.5,
    phaseLabel: 'Phase 8: Under Arm',
    dotShape: 'circle',
  },
  {
    id: 'top-of-the-head',
    name: 'Top of Head (TH)',
    description: 'On the crown of the head',
    benefit: 'Helps release mental fatigue and feel more connected',
    dots: [{ x: 50, y: 21.5 }],
    zoom: 2.0,
    focalX: 50,
    focalY: 21.5,
    phaseLabel: 'Phase 9: Top of Head',
    dotShape: 'circle',
  },
];
