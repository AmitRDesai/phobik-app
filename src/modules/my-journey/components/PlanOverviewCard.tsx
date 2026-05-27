import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function PlanOverviewCard() {
  const router = useRouter();
  const scheme = useScheme();

  return (
    <Card variant="raised" size="lg">
      <View className="gap-3">
        <Text size="h3" weight="bold">
          Plan Overview
        </Text>
        <Text size="sm" tone="secondary">
          Choose your focus for the week ahead. Select one of the personalized
          journeys below or create your own path. Starting a plan helps Phobik
          tailor your daily practices, insights, challenges, and recommendations
          to support where you want to grow.
        </Text>
      </View>

      <View className="mt-6 gap-3">
        <PlanRow
          label="Choose your focus"
          scheme={scheme}
          onPress={() => router.push('/my-journey/choose-focus')}
        />
        <PlanRow
          label="Daily flow"
          scheme={scheme}
          onPress={() => router.push('/daily-flow')}
        />
      </View>
    </Card>
  );
}

interface PlanRowProps {
  label: string;
  scheme: 'light' | 'dark';
  onPress: () => void;
}

function PlanRow({ label, scheme, onPress }: PlanRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="active:opacity-80"
    >
      <View className="flex-row items-center rounded-full border border-foreground/10 bg-surface-input px-6 py-4">
        <Text
          size="xs"
          treatment="caption"
          weight="bold"
          tone="accent"
          className="flex-1"
        >
          {label}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={foregroundFor(scheme, 0.55)}
        />
      </View>
    </Pressable>
  );
}
