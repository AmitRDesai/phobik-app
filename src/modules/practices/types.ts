export interface PracticeCategory {
  id: string;
  category: string;
  duration: string;
  title: string;
  description: string;
  benefit: string;
  benefitIcon: string;
  thumbnailIcon: string;
}

export type AnxietyLevel = 'severe' | 'moderate' | 'mild' | 'calm';

export interface ExerciseStep {
  count: number;
  title: string;
  subtitle: string;
}

export interface Exercise {
  id: string;
  name: string;
  duration: string;
  icon: string;
  iconColor: 'pink' | 'accent';
  anxietyLevels: AnxietyLevel[];
  description?: string;
  steps?: ExerciseStep[];
}
