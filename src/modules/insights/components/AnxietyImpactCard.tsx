import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export function AnxietyImpactCard() {
  return (
    <Card size="lg">
      <View className="mb-4 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-pink/15">
          <MaterialIcons
            name="psychology"
            size={18}
            color={colors.primary.pink}
          />
        </View>
        <Text size="md" weight="bold">
          Anxiety Impact
        </Text>
      </View>

      <Text size="sm" className="text-foreground/80 leading-5">
        Yesterday&apos;s elevated{' '}
        <Text tone="accent" weight="bold">
          cortisol levels
        </Text>{' '}
        from the afternoon stress spike delayed your REM entry by 42 minutes.
      </Text>

      <View className="mt-4 rounded-2xl border-l-2 border-primary-pink bg-foreground/[0.04] px-4 py-3">
        <Text size="xs" tone="secondary" italic>
          &ldquo;Your deep sleep was 15% lower than your baseline. Consider a
          10-minute breathwork session before tonight&apos;s rest.&rdquo;
        </Text>
      </View>

      <Button
        variant="ghost"
        size="xs"
        className="mt-4 self-start"
        icon={
          <MaterialIcons
            name="arrow-forward"
            size={14}
            color={colors.primary.pink}
          />
        }
      >
        Open Guided Relief
      </Button>
    </Card>
  );
}
