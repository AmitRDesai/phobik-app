import { Text } from '@/components/themed/Text';
import { IconChip } from '@/components/ui/IconChip';
import { type AccentHue } from '@/constants/colors';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { View } from 'react-native';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps {
  /**
   * Leading icon. Pass a React node OR a render-prop that receives the
   * resolved tone color (so the icon stays in sync with `tone`).
   */
  icon?: ReactNode | ((color: string) => ReactNode);
  /** Tone for the icon chip background + render-prop color. Default: neutral. */
  tone?: AccentHue;
  /** Headline. */
  title: string;
  /** Optional body copy (sm, tone-secondary, max-width ~320 for readability). */
  description?: string;
  /**
   * Optional CTA — pass a `<Button>` directly. The button is centered
   * below the description.
   */
  action?: ReactNode;
  /** Size axis. Default: `md`. */
  size?: EmptyStateSize;
  /** Outer container className for layout (margins, vertical centering). */
  className?: string;
}

interface SizeConfig {
  chipSize: 'md' | 'lg' | number;
  titleSize: 'md' | 'h3' | 'h2';
  descSize: 'sm' | 'md';
  gap: string;
  py: string;
  descMaxWidth: number;
}

const SIZES: Record<EmptyStateSize, SizeConfig> = {
  sm: {
    chipSize: 'md',
    titleSize: 'md',
    descSize: 'sm',
    gap: 'gap-3',
    py: 'py-6',
    descMaxWidth: 280,
  },
  md: {
    chipSize: 'lg',
    titleSize: 'h3',
    descSize: 'sm',
    gap: 'gap-4',
    py: 'py-10',
    descMaxWidth: 320,
  },
  lg: {
    chipSize: 64,
    titleSize: 'h2',
    descSize: 'md',
    gap: 'gap-5',
    py: 'py-16',
    descMaxWidth: 360,
  },
};

/**
 * Empty-state primitive. Use when a list / screen has no data yet and you
 * want to surface (a) what&apos;s missing and (b) the action that fills it.
 *
 * Three sizes:
 *   sm — inside a Card body (compact filler row)
 *   md — primary empty state for tab / list screens (default)
 *   lg — full-screen empty splash (onboarding, first-run)
 *
 * For "no data on this date" sub-states inside a populated list, prefer
 * a single inline `<Text size="sm" tone="tertiary">` line — EmptyState is
 * heavier and reads as a full-screen miss.
 */
export function EmptyState({
  icon,
  tone,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  const config = SIZES[size];
  return (
    <View className={clsx('items-center', config.py, config.gap, className)}>
      {icon ? (
        <IconChip size={config.chipSize} shape="circle" tone={tone}>
          {icon}
        </IconChip>
      ) : null}

      <View className="items-center gap-1">
        <Text size={config.titleSize} weight="bold" align="center">
          {title}
        </Text>
        {description ? (
          <Text
            size={config.descSize}
            tone="secondary"
            align="center"
            style={{ maxWidth: config.descMaxWidth }}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {action ? <View className="mt-1">{action}</View> : null}
    </View>
  );
}
