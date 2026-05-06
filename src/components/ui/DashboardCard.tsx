import { colors, withAlpha } from '@/constants/colors';
import { clsx } from 'clsx';
import { View, type ViewProps } from 'react-native';

interface DashboardCardProps extends ViewProps {
  glow?: boolean;
  className?: string;
}

const GLOW_SHADOW = {
  boxShadow: `0 8px 24px ${withAlpha(colors.primary.pink, 0.1)}`,
};

export function DashboardCard({
  glow,
  className,
  style,
  children,
  ...rest
}: DashboardCardProps) {
  return (
    <View
      className={clsx(
        'overflow-hidden rounded-3xl border border-foreground/[0.08] bg-surface-elevated p-6',
        className,
      )}
      style={glow ? [GLOW_SHADOW, style] : style}
      {...rest}
    >
      {children}
    </View>
  );
}
