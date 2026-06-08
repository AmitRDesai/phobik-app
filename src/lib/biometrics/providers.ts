import { Platform } from 'react-native';

export const DEVICE_DISPLAY_NAME =
  Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect';

// --- Data-source selection (per-metric authoritative source) ---

// User-selectable data types. Per-metric (hrv collapses sdnn+rmssd); sleep is
// an atomic unit. Whoop-only metrics (recovery_score, strain, spo2, …) are not
// selectable — there's no second source to choose between.
export type SelectableDataType =
  | 'heart_rate'
  | 'hrv'
  | 'resting_hr'
  | 'respiratory_rate'
  | 'sleep';

export const SELECTABLE_DATA_TYPES: SelectableDataType[] = [
  'heart_rate',
  'hrv',
  'resting_hr',
  'respiratory_rate',
  'sleep',
];

export const DATA_TYPE_LABELS: Record<SelectableDataType, string> = {
  heart_rate: 'Heart rate',
  hrv: 'HRV',
  resting_hr: 'Resting HR',
  respiratory_rate: 'Respiratory rate',
  sleep: 'Sleep',
};

// Which selectable data types each provider supplies — drives the dynamic
// selector (only show a type when ≥2 connected providers supply it). Sets for
// O(1) membership checks.
export const PROVIDER_SUPPLIES: Record<string, Set<SelectableDataType>> = {
  apple_health: new Set(SELECTABLE_DATA_TYPES),
  health_connect: new Set(SELECTABLE_DATA_TYPES),
  whoop: new Set(SELECTABLE_DATA_TYPES),
};

// Default precedence seed (higher wins) — the selector's pre-selection until
// the user chooses. Keep in sync with backend PROVIDERS[*].defaultPriority.
export const PROVIDER_PRIORITY: Record<string, number> = {
  whoop: 100,
  apple_health: 50,
  health_connect: 50,
};

/** Map a stored biometric metric → its selectable data type (null if not selectable). */
export function metricToDataType(metric: string): SelectableDataType | null {
  if (metric === 'hrv_sdnn' || metric === 'hrv_rmssd') return 'hrv';
  if (
    metric === 'heart_rate' ||
    metric === 'resting_hr' ||
    metric === 'respiratory_rate'
  ) {
    return metric;
  }
  return null;
}

export function providerDisplayName(slug: string): string {
  switch (slug) {
    case 'apple_health':
      return 'Apple Health';
    case 'health_connect':
      return 'Health Connect';
    case 'whoop':
      return 'WHOOP';
    default:
      return slug;
  }
}
