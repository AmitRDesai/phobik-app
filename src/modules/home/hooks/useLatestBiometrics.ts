export interface LatestBiometrics {
  heartRate: number | null;
  hrv: number | null;
  /** Timestamp of the most recent HR sample (used for stale-data UX). */
  heartRateAt: Date | null;
  /** Timestamp of the most recent HRV sample. */
  hrvAt: Date | null;
  hasAccess: boolean;
  isLoading: boolean;
  /**
   * Whether the underlying Health SDK is available on this device.
   * - iOS: always true (HealthKit ships with iOS).
   * - Android: false on devices where Health Connect is not installed or
   *   needs a provider update; null while still checking.
   */
  sdkAvailable: boolean | null;
  requestAccess: () => Promise<boolean>;
  refresh: () => void;
  /** Forget connection state on this device + best-effort permission revoke. */
  disconnect: () => Promise<void>;
}

export function useLatestBiometrics(): LatestBiometrics {
  return {
    heartRate: null,
    hrv: null,
    heartRateAt: null,
    hrvAt: null,
    hasAccess: false,
    isLoading: false,
    sdkAvailable: false,
    requestAccess: async () => false,
    refresh: () => {},
    disconnect: async () => {},
  };
}
