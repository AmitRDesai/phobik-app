import type { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

export type FlowStep =
  | 'intro'
  | 'stressor'
  | 'check_in'
  | 'feeling'
  | 'body_map'
  | 'body_sensations'
  | 'body_insight'
  | 'ai_analysis'
  | 'player'
  | 'reflection';

/** Coarse energy state from the "I am feeling…" check-in step. */
export type CheckInState =
  | 'low_energy'
  | 'anxious'
  | 'tired_but_wired'
  | 'calm';

export type StressorId =
  | 'work'
  | 'money'
  | 'relationships'
  | 'self_image'
  | 'time'
  | 'connection'
  | 'uncertainty'
  | 'purpose'
  | 'burnout'
  | 'other';

/** Per-family self-reported intensity, 1–10 (feeds the Regulation score). */
export type FeelingIntensities = Partial<Record<EmotionalFamilyId, number>>;

export type TimeOptionId = 'quick_reset' | 'short_flow' | 'full_reset';

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
  icon: IoniconName;
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
  feelingIntensities: FeelingIntensities;
  stressor: StressorId | null;
  checkInState: CheckInState | null;
  bodyRegions: BodyRegionId[];
  sensations: string[];
  analysisResult: AnalysisResult | null;
  affirmationText: string | null;
  affirmationCategory: string | null;
  effectRating: EffectRating | null;
  reflectionText: string | null;
  createdAt: string;
  updatedAt: string;
};
