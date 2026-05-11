import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';

export type SocialAuthProvider = 'google' | 'apple';

const PROVIDER_ICON: Record<
  SocialAuthProvider,
  keyof typeof Ionicons.glyphMap
> = {
  google: 'logo-google',
  apple: 'logo-apple',
};

const PROVIDER_LABEL: Record<SocialAuthProvider, string> = {
  google: 'Sign in with Google',
  apple: 'Sign in with Apple',
};

export interface SocialAuthButtonProps {
  provider: SocialAuthProvider;
  onPress: () => void;
  disabled?: boolean;
  /** Override the accessibility label (defaults to "Sign in with {provider}"). */
  accessibilityLabel?: string;
  className?: string;
}

/**
 * Round 56×56 social-auth button. Compose multiple in a flex-row gap row
 * at the bottom of an auth form. Theme-aware icon color (foreground/0.8
 * on dark, near-black on light) ensures the brand glyphs read on both
 * schemes.
 *
 * Apple sign-in is iOS-only — gate the caller with `Platform.OS === 'ios'`
 * before rendering the apple variant.
 */
export function SocialAuthButton({
  provider,
  onPress,
  disabled,
  accessibilityLabel,
  className,
}: SocialAuthButtonProps) {
  const scheme = useScheme();
  const iconColor =
    scheme === 'dark' ? foregroundFor(scheme, 0.8) : 'rgba(0,0,0,0.78)';

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? PROVIDER_LABEL[provider]}
      accessibilityState={{ disabled: !!disabled }}
      className={clsx(
        'h-14 w-14 items-center justify-center rounded-full border border-foreground/10 bg-foreground/10 active:scale-95',
        disabled && 'opacity-40',
        className,
      )}
    >
      <Ionicons name={PROVIDER_ICON[provider]} size={24} color={iconColor} />
    </Pressable>
  );
}
