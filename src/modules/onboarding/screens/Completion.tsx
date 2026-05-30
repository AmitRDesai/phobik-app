import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { useFlushOnboarding } from '@/modules/onboarding/hooks/useFlushOnboarding';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Completion() {
  const scheme = useScheme();
  const orangeAccent = accentFor(scheme, 'orange');
  const flush = useFlushOnboarding();

  // Persisting onboarding sets `onboarding_completed_at`; the root navigation
  // guard reacts to that and routes the user onward (biometric setup / home).
  const handleGoToToday = async () => {
    try {
      await flush.mutateAsync();
    } catch {
      dialog.error({
        title: 'Something went wrong',
        message: 'We couldn’t save your answers. Please try again.',
      });
    }
  };

  return (
    <Screen
      transparent
      insetTop={false}
      sticky={
        <View className="w-full items-center">
          <Button
            onPress={handleGoToToday}
            loading={flush.isPending}
            icon={
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            }
            fullWidth
          >
            Go to Dashboard
          </Button>
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="mt-6 tracking-[0.3em] text-foreground/45"
            style={{ paddingRight: 3.3 }}
          >
            Your journey starts now
          </Text>
        </View>
      }
      className="px-screen-x"
    >
      <View className="flex-row items-center justify-center gap-2 pt-2">
        <Text size="sm" tone="secondary" weight="medium">
          Onboarding Complete
        </Text>
        <Text size="sm" weight="bold" style={{ color: orangeAccent }}>
          100%
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-10 items-center justify-center">
          <View
            className="absolute size-64 rounded-full border"
            style={{ borderColor: withAlpha(colors.accent.orange, 0.2) }}
          />
          <View className="absolute size-52 rounded-full border border-primary-pink/10" />

          <LinearGradient
            colors={[
              colors.gradient['hot-pink'],
              colors.accent.orange,
              colors.accent.gold,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 192,
              height: 192,
              borderRadius: 9999,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 60px ${withAlpha(colors.accent.orange, 0.5)}`,
            }}
          >
            <View className="size-40 items-center justify-center rounded-full border-2 border-foreground/30 bg-foreground/5">
              <View className="size-32 items-center justify-center rounded-full border border-foreground/20">
                <MaterialIcons name="check-circle" size={64} color="white" />
              </View>
            </View>
          </LinearGradient>

          <View
            className="absolute -right-2 top-8 size-4 rounded-full"
            style={{ backgroundColor: `${colors.accent.yellow}66` }}
          />
          <View
            className="absolute -left-1 bottom-12 size-6 rounded-full"
            style={{ backgroundColor: `${colors.primary.pink}4D` }}
          />
          <View className="absolute left-6 top-2 size-3 rounded-full bg-foreground/40" />
        </View>

        <Text size="display" align="center">
          You&apos;re all set.
        </Text>
        <Text
          size="lg"
          align="center"
          tone="secondary"
          weight="medium"
          className="mt-4 max-w-[280px]"
        >
          Let us walk you through a few features to help you get up and running.
        </Text>
      </View>
    </Screen>
  );
}
