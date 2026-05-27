import { Pressable } from '@/components/themed/Pressable';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { SectionTitle } from './SectionTitle';

export function MyJourneySection() {
  const router = useRouter();
  return (
    <View className="gap-4">
      <SectionTitle prefix="My" accent="Journey" />
      <Card variant="raised" size="md">
        <Text size="md" tone="body">
          Build your best self. Your daily rhythm shapes your future. Small
          actions today become the life you build tomorrow.
        </Text>
        <Pressable
          onPress={() => router.push('/my-journey')}
          className="mt-3 active:opacity-70"
          hitSlop={8}
          accessibilityRole="link"
          accessibilityLabel="Explore plans"
        >
          <Text size="md" weight="bold" tone="accent">
            Explore Plans
          </Text>
        </Pressable>
      </Card>
    </View>
  );
}
