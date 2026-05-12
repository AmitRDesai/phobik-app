import { Button } from '@/components/ui/Button';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { CardAura } from '@/components/ui/CardAura';
import { Divider } from '@/components/ui/Divider';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';

export function AnxietyImpactCard() {
  return (
    <View className="px-4">
      <Card className="overflow-hidden p-5">
        <CardAura color={colors.primary.pink} />
        <View className="mb-3 flex-row items-center gap-2">
          <MaterialIcons
            name="psychology"
            size={20}
            color={colors.primary.pink}
          />
          <Text size="md" weight="bold">
            Anxiety Impact
          </Text>
        </View>
        <View className="gap-3">
          <Text size="sm" className="text-foreground/70">
            Yesterday&apos;s elevated{' '}
            <Text tone="accent" weight="bold">
              cortisol levels
            </Text>{' '}
            from the afternoon stress spike delayed your REM entry by 42
            minutes.
          </Text>
          <Divider />
          <Text size="xs" tone="secondary" italic>
            &ldquo;Your deep sleep was 15% lower than your baseline. Consider a
            10-minute breathwork session before tonight&apos;s rest.&rdquo;
          </Text>
        </View>
        <Button
          variant="ghost"
          size="xs"
          className="mt-4"
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
    </View>
  );
}
