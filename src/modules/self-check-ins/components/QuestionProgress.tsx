import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface QuestionProgressProps {
  current: number;
  total: number;
  sectionLabel?: string;
  showPercentage?: boolean;
}

export function QuestionProgress({
  current,
  total,
  sectionLabel,
  showPercentage,
}: QuestionProgressProps) {
  const progress = current / total;
  const displayNumber = String(current).padStart(2, '0');
  const displayTotal = String(total).padStart(2, '0');

  return (
    <View className="mb-8">
      <View className="mb-4 flex-row items-end justify-between">
        {showPercentage ? (
          <>
            <Text size="lg" weight="bold">
              Question {current} of {total}
            </Text>
            <Text size="sm" weight="bold" className="text-foreground/60">
              {Math.round(progress * 100)}%
            </Text>
          </>
        ) : (
          <>
            <Text size="display">
              {displayNumber}
              <Text size="lg" weight="medium" className="text-foreground/45">
                /{displayTotal}
              </Text>
            </Text>
            {sectionLabel && (
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="text-foreground/60"
              >
                {sectionLabel}
              </Text>
            )}
          </>
        )}
      </View>
      <ProgressBar progress={progress} size="sm" gradient animated />
    </View>
  );
}
