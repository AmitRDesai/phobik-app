import { Card, type CardProps } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { clsx } from 'clsx';

interface DashboardCardProps extends Omit<CardProps, 'variant' | 'tone'> {
  /** Soft pink drop-shadow (used on the home dashboard's glow cards). */
  glow?: boolean;
}

export function DashboardCard({
  glow,
  className,
  children,
  ...rest
}: DashboardCardProps) {
  return (
    <Card
      variant="elevated"
      className={clsx('overflow-hidden', className)}
      shadow={
        glow
          ? { color: colors.primary.pink, opacity: 0.1, blur: 24, offsetY: 8 }
          : undefined
      }
      {...rest}
    >
      {children}
    </Card>
  );
}
