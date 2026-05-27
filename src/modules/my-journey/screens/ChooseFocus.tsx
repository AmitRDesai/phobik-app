import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { FOCUS_PATHS } from '@/modules/my-journey/data/focus-paths';
import { useRouter } from 'expo-router';
import { FocusPathRow } from '../components/FocusPathRow';
import { WeeklyAuraCard } from '../components/WeeklyAuraCard';

export default function ChooseFocus() {
  const router = useRouter();
  return (
    <Screen
      scroll
      header={<Header variant="back" title="Choose your focus" />}
      contentClassName="gap-6 pb-6"
    >
      <Card variant="raised" size="lg">
        <View className="gap-3">
          <Text size="h3" weight="bold">
            Plan Overview
          </Text>
          <Text size="sm" tone="secondary">
            Choose your focus for the week ahead. Select one of the personalized
            journeys below or create your own path. Starting a plan helps Phobik
            tailor your daily practices, insights, challenges, and
            recommendations to support where you want to grow.
          </Text>
        </View>
      </Card>

      <View className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
        {FOCUS_PATHS.map((path, i) => (
          <FocusPathRow
            key={path.id}
            path={path}
            isFirst={i === 0}
            onPress={() => router.push(`/my-journey/focus/${path.id}`)}
          />
        ))}
      </View>

      <WeeklyAuraCard />
    </Screen>
  );
}
