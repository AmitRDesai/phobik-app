import { View as RNView, type ViewProps } from 'react-native';

/**
 * Themed View. Identity wrapper today — exists so feature code imports from
 * `@/components/themed` and never directly from `react-native`. Future
 * theme/variant defaults (e.g. background-color from VariantContext) get
 * added here without touching call sites.
 */
export function View(props: ViewProps) {
  return <RNView {...props} />;
}
