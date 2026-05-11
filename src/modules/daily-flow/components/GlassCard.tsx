import { Card } from '@/components/ui/Card';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className }: Props) {
  return (
    <Card variant="raised" size="lg" className={className}>
      {children}
    </Card>
  );
}
