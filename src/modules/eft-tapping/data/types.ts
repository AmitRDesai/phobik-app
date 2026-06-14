/**
 * Restored EFT-tapping POC types. Originally part of the old daily-flow data
 * model (removed in commit ae33c9d, "new daily flow"). Trimmed to just the
 * tapping-session identifier the standalone POC needs.
 */
export type TappingFeelingId =
  | 'overstimulated'
  | 'unsteady'
  | 'triggered'
  | 'drained'
  | 'disconnected';
