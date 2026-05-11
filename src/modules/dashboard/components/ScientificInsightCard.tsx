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
        size="xs"
        treatment="caption"
        tone="accent"
        weight="bold"
        className="tracking-widest"
      >
        Scientific Insight
      </Text>
      <Text size="sm" className="mt-2 text-foreground/70">
        {CHEMICAL_META[lowest].scientificInsight}
      </Text>
    </Card>
  );
}
