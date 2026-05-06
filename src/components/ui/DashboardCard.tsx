import { Card, type CardProps } from '@/components/ui/Card';
import { colors, withAlpha } from '@/constants/colors';

interface DashboardCardProps extends Omit<CardProps, 'variant' | 'tone'> {
  /** Soft pink drop-shadow (used on the home dashboard's glow cards). */
  glow?: boolean;
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
    <Card
      variant="elevated"
      className={className ? `overflow-hidden ${className}` : 'overflow-hidden'}
      style={glow ? [GLOW_SHADOW, style as object] : style}
      {...rest}
    >
      {children}
    </Card>
  );
}
