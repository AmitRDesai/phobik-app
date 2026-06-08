import dayjs from 'dayjs';

import type { FlowStep } from './types';

export function isTodayLocal(iso: string): boolean {
  return dayjs(iso).isSame(dayjs(), 'day');
}

export const STEP_ROUTES: Record<FlowStep, string> = {
  intro: '/daily-flow/intro',
  stressor: '/daily-flow/stressor',
  check_in: '/daily-flow/check-in',
  feeling: '/daily-flow/feeling',
  body_map: '/daily-flow/body-map',
  body_sensations: '/daily-flow/body-sensations',
  body_insight: '/daily-flow/body-insight',
  ai_analysis: '/daily-flow/ai-analysis',
  player: '/daily-flow/player',
  reflection: '/daily-flow/reflection',
};

const STEP_ORDER: FlowStep[] = [
  'intro',
  'stressor',
  'check_in',
  'feeling',
  'body_map',
  'body_sensations',
  'body_insight',
  'ai_analysis',
  'player',
  'reflection',
];

export function getPreviousStep(current: FlowStep): FlowStep | null {
  const idx = STEP_ORDER.indexOf(current);
  if (idx <= 0) return null;
  return STEP_ORDER[idx - 1];
}

export function getNextStep(current: FlowStep): FlowStep | null {
  const idx = STEP_ORDER.indexOf(current);
  if (idx === -1 || idx === STEP_ORDER.length - 1) return null;
  return STEP_ORDER[idx + 1];
}

/**
 * Walk backwards from `target` to `intro` so we can stack every prior screen
 * on the navigator. Lets the user press back from a resumed step and pop
 * through each earlier screen.
 */
export function buildStepPath(target: FlowStep): FlowStep[] {
  const idx = STEP_ORDER.indexOf(target);
  if (idx === -1) return ['intro'];
  return STEP_ORDER.slice(0, idx + 1);
}

export { dismissToRoot as exitDailyFlow } from '@/utils/navigation';
