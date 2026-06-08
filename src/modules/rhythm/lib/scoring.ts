/**
 * My Rhythm scoring — pure, unit-testable functions. No hooks, no I/O.
 *
 * My Rhythm is one 0–100 score composed of four weighted pillars:
 *   Recovery 30% · Regulation 30% · Movement 20% · Resilience 20%.
 *
 * Only the Regulation algorithm is fully specified by product; the other three
 * use reasonable, documented formulas (constants tunable later).
 */

export const PILLAR_WEIGHTS = {
  recovery: 0.3,
  regulation: 0.3,
  movement: 0.2,
  resilience: 0.2,
} as const;

export function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, n));
}

// ─── Regulation (Nervous System) ──────────────────────────────────────────
// Stress Score = SelfReport×0.60 + BiometricStress×0.40, then inverted so a
// *higher* Regulation score = better-regulated nervous system.

/** HRV today vs 30-day baseline → 0–80 stress points (more drop = more stress). */
export function hrvStressPoints(todayHrv: number, baselineHrv: number): number {
  if (baselineHrv <= 0) return 0;
  const pctLower = ((baselineHrv - todayHrv) / baselineHrv) * 100;
  if (pctLower <= 0) return 0;
  if (pctLower <= 5) return 10;
  if (pctLower <= 10) return 20;
  if (pctLower <= 20) return 40;
  if (pctLower <= 30) return 60;
  return 80;
}

/** Resting HR today vs baseline → 0–80 stress points (higher = more stress). */
export function rhrStressPoints(todayRhr: number, baselineRhr: number): number {
  if (baselineRhr <= 0) return 0;
  const pctHigher = ((todayRhr - baselineRhr) / baselineRhr) * 100;
  if (pctHigher <= 0) return 0;
  if (pctHigher <= 5) return 10;
  if (pctHigher <= 10) return 20;
  if (pctHigher <= 15) return 40;
  if (pctHigher <= 20) return 60;
  return 80;
}

/** Biometric stress 0–100 = HRV stress ×0.70 + RHR stress ×0.30. */
export function biometricStress(hrvStress: number, rhrStress: number): number {
  return clamp(hrvStress * 0.7 + rhrStress * 0.3);
}

/** Daily-Flow intensity (1–10) → self-report stress % (10–100). */
export function selfReportStress(intensity: number): number {
  return clamp(intensity * 10);
}

/** Combined stress 0–100 (self-report 60% + biometric 40%). */
export function stressScore(selfReport: number, biometric: number): number {
  return clamp(selfReport * 0.6 + biometric * 0.4);
}

/** Regulation 0–100 (higher = better) = 100 − stress. */
export function regulationScore(stress: number): number {
  return clamp(100 - stress);
}

// ─── Recovery ───────────────────────────────────────────────────────────
/** 0.70 × sleep quality + 0.30 × consistency. Null if no sleep data. */
export function recoveryScore(
  sleepQuality: number | null,
  consistency: number | null,
): number | null {
  if (sleepQuality == null) return null;
  if (consistency == null) return Math.round(sleepQuality);
  return Math.round(sleepQuality * 0.7 + consistency * 0.3);
}

/** Consistency 0–100 from recent sleep durations — lower variance = higher. */
export function consistencyScore(durationsMin: number[]): number | null {
  if (durationsMin.length < 2) return null;
  const mean = durationsMin.reduce((a, b) => a + b, 0) / durationsMin.length;
  if (mean <= 0) return null;
  const variance =
    durationsMin.reduce((a, b) => a + (b - mean) ** 2, 0) / durationsMin.length;
  const cv = Math.sqrt(variance) / mean; // coefficient of variation
  // cv 0 → 100; cv ≥ 0.5 → 0.
  return clamp(Math.round(100 * (1 - cv / 0.5)));
}

// ─── Movement ─────────────────────────────────────────────────────────────
export const STEP_GOAL = 10000;
export const ACTIVE_MINUTES_GOAL = 30;

/** Steps today vs an 8k goal, blended with the 30-day baseline. */
export function stepsScore(
  todaySteps: number,
  baselineSteps: number | null,
): number {
  const goalScore = clamp((todaySteps / STEP_GOAL) * 100);
  if (baselineSteps == null || baselineSteps <= 0) return Math.round(goalScore);
  const baselineScore = clamp((todaySteps / baselineSteps) * 80); // matching baseline → 80
  return Math.round(goalScore * 0.6 + baselineScore * 0.4);
}

export function activeMinutesScore(
  minutes: number,
  goal = ACTIVE_MINUTES_GOAL,
): number {
  return clamp(Math.round((minutes / goal) * 100));
}

/** 0.70 × steps + 0.30 × active minutes. */
export function movementScore(
  steps: number | null,
  active: number | null,
): number | null {
  if (steps == null && active == null) return null;
  if (active == null) return steps;
  if (steps == null) return active;
  return Math.round(steps * 0.7 + active * 0.3);
}

// ─── Resilience ─────────────────────────────────────────────────────────
/** 5-point self-efficacy check-in (index 0–4) → 0/25/50/75/100. */
export function resilienceFromCheckIn(index: number): number {
  return clamp(index * 25);
}

// ─── Composite ─────────────────────────────────────────────────────────
export type PillarKey = keyof typeof PILLAR_WEIGHTS;
export type PillarScores = Record<PillarKey, number | null>;

/** Weighted mean over the pillars that have data (weights renormalized). */
export function rhythmScore(scores: PillarScores): number | null {
  let sum = 0;
  let weightSum = 0;
  for (const key of Object.keys(PILLAR_WEIGHTS) as PillarKey[]) {
    const value = scores[key];
    if (value != null) {
      sum += value * PILLAR_WEIGHTS[key];
      weightSum += PILLAR_WEIGHTS[key];
    }
  }
  if (weightSum === 0) return null;
  return Math.round(sum / weightSum);
}

export type RhythmLevel = {
  label: string;
  status: string;
};

/** "+N% vs last week"-style delta from a trend series (first → last). Null if <2 points. */
export function trendDeltaLabel(values: number[]): string | undefined {
  if (values.length < 2) return undefined;
  const first = values[0];
  const last = values[values.length - 1];
  if (first <= 0) return undefined;
  const pct = Math.round(((last - first) / first) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}% vs last week`;
}

/** Headline band + companion status (matches design copy: 76 → "Thriving"). */
export function levelForRhythm(score: number | null): RhythmLevel {
  if (score == null) return { label: 'No Data', status: 'Connect to begin' };
  if (score >= 76) return { label: 'Thriving', status: 'Building Momentum' };
  if (score >= 51) return { label: 'Balanced', status: 'Holding Steady' };
  if (score >= 26) return { label: 'Building', status: 'Finding Your Rhythm' };
  return { label: 'Recovering', status: 'Be Gentle With Yourself' };
}
