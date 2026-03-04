import { clsx } from 'clsx';
import { View, type ViewProps } from 'react-native';

interface DashboardCardProps extends ViewProps {
  glow?: boolean;
  className?: string;
}

export function DashboardCard({
  glow,
  className,
  children,
  ...rest
}: DashboardCardProps) {
  return (
    <View
      className={clsx(
        'overflow-hidden rounded-3xl border border-white/[0.08] bg-white/5 p-6',
        glow && 'ios:shadow-2xl ios:shadow-primary-pink/10 android:elevation-4',
        className,
      )}
      {...rest}
    >
      {children}
    </View>
  );
}
