import { Text } from '@/components/themed/Text';
import {
  accentFor,
  colors,
  foregroundFor,
  withAlpha,
  type AccentHue,
} from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

export type InfoCalloutVariant = 'tinted' | 'plain';
export type InfoCalloutSize = 'sm' | 'md';

/**
 * InfoCallout's tone surface. Accepts the standard accent hues (cyan,
 * purple, etc.) AND the three status tones (danger, warning, success) so
 * a single primitive covers both informational tips and validation /
 * status callouts.
 */
export type InfoCalloutTone = AccentHue | 'danger' | 'warning' | 'success';

export interface InfoCalloutProps {
  title: string;
  description?: string;
  /**
   * Leading icon — ReactNode or render-prop that receives the resolved
   * accent color (so option icons can match the callout tone).
   */
  icon?: ReactNode | ((color: string) => ReactNode);
  /** Accent color for the icon chip + tinted border / bg. Default: `cyan`. */
  tone?: InfoCalloutTone;
  /**
   * Visual style.
   *   tinted (default) — bg + border tinted with `tone` at low alpha
   *   plain           — neutral foreground/5 bg + foreground/10 border
   */
  variant?: InfoCalloutVariant;
  /** Optional trailing action (pass a Button). */
  action?: ReactNode;
  /** When set, renders an X button top-right that calls this on press. */
  onDismiss?: () => void;
  /** Size. Default: `md`. */
  size?: InfoCalloutSize;
  className?: string;
}

const SIZE_PAD: Record<InfoCalloutSize, string> = {
  sm: 'px-3 py-3 gap-3',
  md: 'px-4 py-4 gap-4',
};

const SIZE_CHIP_PX: Record<InfoCalloutSize, number> = {
  sm: 40,
  md: 48,
};

function resolveTone(tone: InfoCalloutTone, scheme: 'light' | 'dark'): string {
  if (tone === 'danger') return colors.status.danger;
  if (tone === 'warning') return colors.status.warning;
  if (tone === 'success') return colors.status.success;
  return accentFor(scheme, tone);
}

/**
 * Inline informational callout. Use for tips, hints, soft warnings, and
 * promotional moments that should stay visible while the user reads the
 * surrounding content — NOT for transient confirmations (Toast),
 * acknowledgement-required alerts (Dialog), or always-on offline status
 * (NetworkBanner).
 *
 * Visual: icon chip + title + optional description + optional action,
 * laid out in a horizontal row inside a tinted (or plain) bordered
 * container. Pass `onDismiss` to add an X close affordance.
 *
 * `tone` accepts AccentHue (`pink`/`cyan`/`yellow`/...) and the status
 * tones (`danger`/`warning`/`success`). Use status tones for validation
 * errors, security warnings, and success confirmations that should stay
 * on screen.
 */
export function InfoCallout({
  title,
  description,
  icon,
  tone = 'cyan',
  variant = 'tinted',
  action,
  onDismiss,
  size = 'md',
  className,
}: InfoCalloutProps) {
  const scheme = useScheme();
  const accent = resolveTone(tone, scheme);
  const chipPx = SIZE_CHIP_PX[size];

  const containerStyle =
    variant === 'tinted'
      ? {
          backgroundColor: withAlpha(accent, 0.1),
          borderColor: withAlpha(accent, 0.3),
        }
      : undefined;

  const resolvedIcon = typeof icon === 'function' ? icon(accent) : icon;

  return (
    <View
      accessibilityRole="alert"
      className={clsx(
        'rounded-2xl border',
        variant === 'plain' ? 'border-foreground/10 bg-foreground/5' : '',
        SIZE_PAD[size],
        className,
      )}
      style={containerStyle}
    >
      <View className="flex-row items-start gap-3">
        {icon ? (
          <View
            className="items-center justify-center rounded-full"
            style={{
              width: chipPx,
              height: chipPx,
              borderRadius: chipPx / 2,
              backgroundColor: withAlpha(accent, 0.15),
            }}
          >
            {resolvedIcon}
          </View>
        ) : null}
        <View className="flex-1 gap-1">
          <Text size={size === 'sm' ? 'sm' : 'md'} weight="semibold">
            {title}
          </Text>
          {description ? (
            <Text size="sm" tone="secondary">
              {description}
            </Text>
          ) : null}
          {action ? <View className="mt-2">{action}</View> : null}
        </View>
        {onDismiss ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onDismiss();
            }}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            hitSlop={8}
            className="active:opacity-60"
          >
            <Ionicons
              name="close"
              size={18}
              color={foregroundFor(scheme, 0.55)}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
