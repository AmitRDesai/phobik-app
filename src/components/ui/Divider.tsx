import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { clsx } from 'clsx';

export interface DividerProps {
  /** Optional centered label text. When omitted, renders a single hairline. */
  label?: string;
  /** Outer container className — typically used for vertical margin. */
  className?: string;
}

/**
 * Theme-aware hairline divider. With a `label`, renders as
 * `——— label ———` (two flex-1 hairlines flanking centered text).
 * Without a label, renders as a single full-width hairline.
 *
 * Use for: auth screen section breaks ("or continue with"), settings
 * group separators, list section dividers.
 */
export function Divider({ label, className }: DividerProps) {
  if (!label) {
    return <View className={clsx('h-px bg-foreground/10', className)} />;
  }

  return (
    <View className={clsx('flex-row items-center', className)}>
      <View className="h-px flex-1 bg-foreground/10" />
      <Text size="sm" tone="secondary" className="mx-4">
        {label}
      </Text>
      <View className="h-px flex-1 bg-foreground/10" />
    </View>
  );
}
