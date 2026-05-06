import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: Props) {
  return (
    <View
      className={clsx(
        'rounded-3xl border border-foreground/10 bg-foreground/[0.04] p-6',
        className,
      )}
    >
      {children}
    </View>
  );
}
