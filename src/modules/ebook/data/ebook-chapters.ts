export interface EbookChapter {
  id: number;
  label: string;
  title: string;
}

export const EBOOK_CHAPTERS: EbookChapter[] = [
  { id: 0, label: 'Foreword', title: 'A Personal Note' },
  { id: -1, label: 'Introduction', title: 'A New Way to Understand' },
  { id: 1, label: 'Chapter 1', title: 'How Flying Works' },
  { id: 2, label: 'Chapter 2', title: 'How Anxiety Actually Works' },
  { id: 3, label: 'Chapter 3', title: "Your Brain's Alarm System" },
  { id: 4, label: 'Chapter 4', title: 'Why Flying Is a Perfect Storm' },
  { id: 5, label: 'Chapter 5', title: 'Why Regulation Practice Matters' },
  { id: 6, label: 'Chapter 6', title: 'Your Inner CEO' },
  { id: 7, label: 'Chapter 7', title: 'When Fear Begins' },
  {
    id: 8,
    label: 'Chapter 8',
    title: 'Getting Trapped in Your Own Fear',
  },
  { id: 9, label: 'Chapter 9', title: 'Stories During Turbulence' },
  { id: 10, label: 'Chapter 10', title: 'Rumination Loop' },
  { id: 11, label: 'Chapter 11', title: 'Executive Function Overload' },
  { id: 12, label: 'Chapter 12', title: 'Frozen Executive Function' },
  { id: 13, label: 'Chapter 13', title: 'Panic Is Not Always Danger' },
  {
    id: 14,
    label: 'Chapter 14',
    title: 'Automatic vs. Manual Regulation',
  },
  {
    id: 15,
    label: 'Chapter 15',
    title: 'Building Tolerance Without Avoidance',
  },
  {
    id: 16,
    label: 'Chapter 16',
    title: 'Strengthening the Nervous System',
  },
  { id: 17, label: 'Chapter 17', title: 'Anticipatory Anxiety' },
  { id: 18, label: 'Chapter 18', title: 'Identity Shift' },
  {
    id: 19,
    label: 'Chapter 19',
    title: 'Setbacks, Slips, and Relapse Prevention',
  },
  { id: 20, label: 'Chapter 20', title: 'The Goal is Freedom' },
  { id: 21, label: 'Chapter 21', title: 'The C.A.L.M. Method' },
  { id: 22, label: 'Chapter 22', title: 'Closing Reflections' },
];

export const TOTAL_CHAPTERS = EBOOK_CHAPTERS.length;
