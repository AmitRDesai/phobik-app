export type FlowStep =
  | 'landing'
  | 'light_exposure'
  | 'stillness'
  | 'mental_reset'
  | 'movement'
  | 'cold_exposure'
  | 'nourishment'
  | 'deep_focus';

export type MorningResetSession = {
  id: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentStep: FlowStep;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
