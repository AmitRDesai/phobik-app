import { BlurView as BaseBlurView, type BlurViewProps } from 'expo-blur';

/**
 * Drop-in BlurView wrapper. Uses native blur on iOS automatically.
 * On Android, BlurView renders a semi-transparent tinted overlay (blurMethod defaults to 'none').
 */
export function BlurView(props: BlurViewProps) {
  return <BaseBlurView {...props} />;
}
