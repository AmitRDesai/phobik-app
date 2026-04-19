import dayjs from 'dayjs';
import type { Router } from 'expo-router';

import { getFeeling } from './feelings';
import type { FeelingId, FlowStep } from './types';

type AddOns = { eft: boolean; bilateral: boolean };

export function isTodayLocal(iso: string): boolean {
  return dayjs(iso).isSame(dayjs(), 'day');
}

export const STEP_ROUTES: Record<FlowStep, string> = {
  intro: '/daily-flow/intro',
  feeling: '/daily-flow/feeling',
  feeling_detail: '/daily-flow/feeling-detail',
  guide: '/daily-flow/guide',
  intention: '/daily-flow/intention',
  detailed_feeling: '/daily-flow/detailed-feeling',
  support_options: '/daily-flow/support-options',
  player: '/daily-flow/player',
  bi_lateral_tutorial: '/daily-flow/bi-lateral-tutorial',
  eft_guide: '/daily-flow/eft-guide',
  eft_toh_focus: '/daily-flow/eft-toh-focus',
  tapping: '/daily-flow/tapping',
  reflection: '/daily-flow/reflection',
};

export const STEPS_NEEDING_FEELING: FlowStep[] = ['feeling_detail', 'tapping'];

export function getPreviousStep(
  current: FlowStep,
  addOns: AddOns,
): FlowStep | null {
  switch (current) {
    case 'intro':
      return null;
    case 'feeling':
      return 'intro';
    case 'feeling_detail':
      return 'feeling';
    case 'guide':
      return 'feeling_detail';
    case 'intention':
      return 'guide';
    case 'detailed_feeling':
      return 'intention';
    case 'support_options':
      return 'detailed_feeling';
    case 'player':
      return 'support_options';
    case 'bi_lateral_tutorial':
      return 'player';
    case 'eft_guide':
      return addOns.bilateral ? 'bi_lateral_tutorial' : 'player';
    case 'eft_toh_focus':
      return 'eft_guide';
    case 'tapping':
      if (addOns.eft) return 'eft_toh_focus';
      if (addOns.bilateral) return 'bi_lateral_tutorial';
      return 'player';
    case 'reflection':
      if (addOns.eft) return 'tapping';
      if (addOns.bilateral) return 'tapping';
      return 'player';
  }
}

/**
 * Replace-navigate to a flow step. Always uses router.replace so the stack
 * only ever contains [Today, currentFlowScreen] — no duplicates, no stack
 * growth across back/forward. Step state persists in PowerSync so on app
 * restart the dispatcher lands the user on the right screen.
 */
export function navigateToStep(
  router: Router,
  step: FlowStep,
  feelingId?: string | null,
) {
  const pathname = STEP_ROUTES[step];
  if (STEPS_NEEDING_FEELING.includes(step) && feelingId) {
    router.replace({
      pathname: pathname as never,
      params: { feelingId },
    });
  } else {
    router.replace(pathname as never);
  }
}

/**
 * Exit the daily-flow nested stack back to the root route. dismissTo
 * unwinds the nested stack in one op when available; if the nested stack
 * has no ancestor (fresh install / deep link), fall back to replace.
 * Kept in a plain module fn so try/catch doesn't block React Compiler
 * from optimizing calling components.
 */
/**
 * Walk backwards from `target` to `intro` so we can stack every prior
 * screen on the navigator. Lets the user press back from a resumed step
 * and pop through each earlier screen.
 */
export function buildStepPath(target: FlowStep, addOns: AddOns): FlowStep[] {
  const path: FlowStep[] = [target];
  let cursor: FlowStep | null = target;
  while (cursor && cursor !== 'intro') {
    const prev: FlowStep | null = getPreviousStep(cursor, addOns);
    if (!prev) break;
    path.unshift(prev);
    cursor = prev;
  }
  return path;
}

export function resolveStepRoute(
  step: FlowStep,
  rawFeelingId: string | null,
): { pathname: string; params?: Record<string, string> } {
  const pathname = STEP_ROUTES[step];
  if (step === 'feeling_detail' && rawFeelingId) {
    return { pathname, params: { feelingId: rawFeelingId } };
  }
  if (step === 'tapping' && rawFeelingId) {
    const tappingId =
      getFeeling(rawFeelingId as FeelingId)?.tappingFeelingId ?? rawFeelingId;
    return { pathname, params: { feelingId: tappingId } };
  }
  return { pathname };
}

export { dismissToRoot as exitDailyFlow } from '@/utils/navigation';
