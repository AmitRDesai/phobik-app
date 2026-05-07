import { Text } from '@/components/themed/Text';
import { Card } from '@/components/ui/Card';
import { CHEMICAL_META, type Chemical } from '../lib/dose-copy';

interface ScientificInsightCardProps {
  lowest: Chemical;
}

export function ScientificInsightCard({ lowest }: ScientificInsightCardProps) {
  return (
    <Card variant="toned" tone="pink">
      <Text
        variant="caption"
        className="font-bold tracking-widest text-primary-pink"
      >
        Scientific Insight
      </Text>
      <Text variant="sm" className="mt-2 text-foreground/70">
        {CHEMICAL_META[lowest].scientificInsight}
      </Text>
    </Card>
  );
}
