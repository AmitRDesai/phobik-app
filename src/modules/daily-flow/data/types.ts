export type FlowStep =
  | 'intro'
  | 'feeling'
  | 'body_map'
  | 'body_sensations'
  | 'ai_analysis'
  | 'body_insight'
  | 'player'
  | 'reflection';

export type TimeOptionId =
  | 'quick_reset'
  | 'short_flow'
  | 'balanced_flow'
  | 'deep_flow'
  | 'full_reset';

export type EmotionalFamilyId =
  | 'activated'
  | 'heavy'
  | 'mixed'
  | 'grounded'
  | 'energized'
  | 'connected';

export type BodyRegionId =
  | 'head_mind'
  | 'shoulders_neck'
  | 'chest_breath'
  | 'heart_space'
  | 'back'
  | 'stomach_gut'
  | 'hands_arms'
  | 'legs_feet'
  | 'whole_body';

export type SensationCategoryId =
  | 'tension'
  | 'activation'
  | 'calm'
  | 'movement'
  | 'low_energy';

export type EffectRating = 'worse' | 'same' | 'better';

export interface AnalysisObservation {
  title: string;
  description: string;
  icon: string;
}

export interface FlowStepTemplate {
  id: string;
  label: string;
  durationSeconds: number;
}

export interface AnalysisResult {
  theme: string;
  observations: AnalysisObservation[];
  flow: FlowStepTemplate[];
}

export type DailyFlowSession = {
  id: string;
  userId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentStep: FlowStep;
  startedAt: string;
  completedAt: string | null;
  timeOption: TimeOptionId | null;
  emotionalFamilies: EmotionalFamilyId[];
  bodyRegions: BodyRegionId[];
  sensations: string[];
  analysisResult: AnalysisResult | null;
  effectRating: EffectRating | null;
  reflectionText: string | null;
  createdAt: string;
  updatedAt: string;
};
