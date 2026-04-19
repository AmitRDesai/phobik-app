export type FlowStep =
  | 'intro'
  | 'feeling'
  | 'feeling_detail'
  | 'guide'
  | 'intention'
  | 'detailed_feeling'
  | 'support_options'
  | 'player'
  | 'bi_lateral_tutorial'
  | 'eft_guide'
  | 'eft_toh_focus'
  | 'tapping'
  | 'reflection';

export type FeelingId =
  | 'overwhelmed'
  | 'low'
  | 'anxious'
  | 'drained'
  | 'disconnected';

export type TappingFeelingId =
  | 'overstimulated'
  | 'unsteady'
  | 'triggered'
  | 'drained'
  | 'disconnected';

export type ReflectionAnswer =
  | 'more_steady'
  | 'a_little_better'
  | 'same'
  | 'need_reset';

export type SupportOptionId =
  | 'neural_bloom'
  | 'vibrational_salt'
  | 'amber_glow';

export type DailyFlowSession = {
  id: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentStep: FlowStep;
  startedAt: string;
  completedAt: string | null;
  feeling: FeelingId | null;
  intention: string | null;
  supportOption: SupportOptionId | null;
  addOns: { eft: boolean; bilateral: boolean };
  reflection: ReflectionAnswer | null;
  createdAt: string;
  updatedAt: string;
};
