import type { BiometricSample } from './biometrics-storage';

export type WindowReadResult = {
  hrSamples: BiometricSample[];
  hrvSamples: BiometricSample[];
  /** Resting HR + respiratory rate combined — non-dashboard metrics. */
  extraSamples: BiometricSample[];
};

export async function readHealthSamplesInWindow(
  _startDate: Date,
  _endDate: Date,
): Promise<WindowReadResult> {
  return { hrSamples: [], hrvSamples: [], extraSamples: [] };
}
