import type { BodyRegionId } from './types';

export interface BodyRegion {
  id: BodyRegionId;
  label: string;
}

export const BODY_REGIONS: readonly BodyRegion[] = [
  { id: 'head_mind', label: 'Head & Mind' },
  { id: 'shoulders_neck', label: 'Shoulders & Neck' },
  { id: 'chest_breath', label: 'Chest & Breath' },
  { id: 'heart_space', label: 'Heart Space' },
  { id: 'back', label: 'Back' },
  { id: 'stomach_gut', label: 'Stomach & Gut' },
  { id: 'hands_arms', label: 'Hands & Arms' },
  { id: 'legs_feet', label: 'Legs & Feet' },
  { id: 'whole_body', label: 'Whole Body' },
] as const;

export function getBodyRegion(id: BodyRegionId): BodyRegion | undefined {
  return BODY_REGIONS.find((r) => r.id === id);
}
