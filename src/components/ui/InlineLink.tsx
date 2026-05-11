import { Text } from '@/components/themed/Text';
import { clsx } from 'clsx';
import { Pressable } from 'react-native';

export interface InlineLinkProps {
  /** Prefix text rendered in `tone="secondary"`. */
  prefix?: string;
  /** Action text rendered in `tone="accent"` + `weight="bold"`. */
  action: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Inline link with mixed-tone children — secondary prefix + accent action
 * word. Replaces the common auth-screen `<Pressable>` wrapping a Text with
 * a `<Text tone="accent">` action inside ("Already have an account?
 * **Sign In**").
 *
 * Tap target is the whole row; the action word visually anchors it.
 * Centered single-line layout by default — wrap in your own View for
 * custom alignment.
 */
export function InlineLink({
  prefix,
  action,
  onPress,
  disabled,
  className,
}: InlineLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="link"
      accessibilityLabel={prefix ? `${prefix} ${action}` : action}
      accessibilityState={{ disabled: !!disabled }}
      className={clsx('py-2', className)}
      style={disabled ? { opacity: 0.4 } : undefined}
    >
      <Text size="sm" tone="secondary" align="center">
        {prefix ? `${prefix} ` : ''}
        <Text size="sm" tone="accent" weight="bold">
          {action}
        </Text>
      </Text>
    </Pressable>
  );
}
