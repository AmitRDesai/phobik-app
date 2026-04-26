import dayjs from 'dayjs';
import type { Router } from 'expo-router';

import type { FlowStep } from './types';

export function isTodayLocal(iso: string): boolean {
  return dayjs(iso).isSame(dayjs(), 'day');
}

export const STEP_ROUTES: Record<FlowStep, string> = {
  landing: '/morning-reset',
  light_exposure: '/morning-reset/light-exposure',
  stillness: '/morning-reset/stillness',
  mental_reset: '/morning-reset/mental-reset',
  movement: '/morning-reset/movement',
  cold_exposure: '/morning-reset/cold-exposure',
  nourishment: '/morning-reset/nourishment',
  deep_focus: '/morning-reset/deep-focus',
};

export const STEP_ORDER: FlowStep[] = [
  'landing',
  'light_exposure',
  'stillness',
  'mental_reset',
  'movement',
  'cold_exposure',
  'nourishment',
  'deep_focus',
];

export function getNextStep(current: FlowStep): FlowStep | null {
  const idx = STEP_ORDER.indexOf(current);
  if (idx < 0 || idx >= STEP_ORDER.length - 1) return null;
  return STEP_ORDER[idx + 1] ?? null;
}

export function getPreviousStep(current: FlowStep): FlowStep | null {
  const idx = STEP_ORDER.indexOf(current);
  if (idx <= 0) return null;
  return STEP_ORDER[idx - 1] ?? null;
}

/**
 * Replace-navigate to a step. Uses router.replace so the stack only
 * contains [Today, currentStep] across forward navigation. On resume
 * we explicitly stack prior steps via buildStepPath so back unwinds.
 */
export function navigateToStep(router: Router, step: FlowStep) {
  router.replace(STEP_ROUTES[step] as never);
}

/** Walk backwards from `target` to `landing` so back-nav pops naturally. */
export function buildStepPath(target: FlowStep): FlowStep[] {
  const idx = STEP_ORDER.indexOf(target);
  if (idx < 0) return ['landing'];
  return STEP_ORDER.slice(0, idx + 1);
}

export { dismissToRoot as exitMorningReset } from '@/utils/navigation';
