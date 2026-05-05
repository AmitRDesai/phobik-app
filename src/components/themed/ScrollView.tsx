import { ScrollView as RNScrollView, type ScrollViewProps } from 'react-native';

/**
 * Themed ScrollView. Identity wrapper today — exists so feature code imports
 * from `@/components/themed` and never directly from `react-native`.
 */
export function ScrollView(props: ScrollViewProps) {
  return <RNScrollView {...props} />;
}
