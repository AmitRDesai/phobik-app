import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { findFocusPath } from '@/modules/my-journey/data/focus-paths';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function FocusDetail() {
  const router = useRouter();
  const scheme = useScheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const path = id ? findFocusPath(id) : undefined;

  if (!path) {
    return (
      <Screen header={<Header variant="back" />} contentClassName="flex-1">
        <EmptyState
          size="lg"
          tone="pink"
          title="Path not found"
          description="We couldn't find that focus path. Pick another from the list."
          icon={(color) => (
            <Ionicons name="alert-circle-outline" size={32} color={color} />
          )}
          action={
            <Button variant="secondary" onPress={() => router.back()}>
              Go back
            </Button>
          }
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      header={<Header variant="back" title={path.label} />}
      contentClassName="gap-6 pb-6"
      sticky={
        <Button onPress={() => router.dismissAll()}>Back to Journey</Button>
      }
    >
      <View className="items-center gap-4 py-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-pink/15">
          <Ionicons
            name={path.icon}
            size={36}
            color={foregroundFor(scheme, 0.85)}
          />
        </View>
        <Text size="display" weight="extrabold" align="center">
          {path.label}
        </Text>
        <Text size="md" tone="secondary" align="center">
          {path.description}
        </Text>
      </View>

      <Card variant="raised" size="lg">
        <Text size="h3" weight="bold">
          Coming soon
        </Text>
        <Text size="sm" tone="secondary" className="mt-2">
          Your {path.label} plan is being prepared. Soon, this is where you will
          see your daily practices, insights, and the milestones that move you
          forward.
        </Text>
      </Card>
    </Screen>
  );
}
