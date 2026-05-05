import { Pressable as RNPressable, type PressableProps } from 'react-native';

/**
 * Themed Pressable. Identity wrapper today — exists so feature code imports
 * from `@/components/themed` and never directly from `react-native`. Future
 * default press feedback / haptics get added here.
 */
export function Pressable(props: PressableProps) {
  return <RNPressable {...props} />;
}
