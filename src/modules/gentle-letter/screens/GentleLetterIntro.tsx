import { Button } from '@/components/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Header } from '@/components/ui/Header';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

export default function GentleLetterIntro() {
  const router = useRouter();
  const scheme = useScheme();
  const muted = foregroundFor(scheme, 0.6);

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          center={
            <Text size="xs" treatment="caption" tone="secondary" weight="bold">
              Practice
            </Text>
          }
        />
      }
      sticky={
        <View>
          <Button onPress={() => router.push('/practices/gentle-letter/write')}>
            Start My Letter
          </Button>
          <Button
            variant="ghost"
            onPress={() => router.push('/practices/gentle-letter/archive')}
            className="mt-4"
            prefixIcon={
              <MaterialIcons name="history" size={20} color={muted} />
            }
          >
            View Past Letters
          </Button>
        </View>
      }
      contentClassName="items-center"
      className="px-6"
    >
      <View className="relative mb-12 mt-20 items-center justify-center">
        <RadialGlow
          color={colors.primary.pink}
          size={200}
          style={{ top: -60, left: -60 }}
        />
        <View
          className="h-32 w-32 items-center justify-center rounded-full border border-foreground/10 bg-primary-pink/10"
          style={{
            boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <MaterialIcons
            name="filter-vintage"
            size={56}
            color={colors.primary['pink-light']}
          />
        </View>
      </View>

      <Text size="h1" align="center" className="mb-4 leading-tight">
        Write a Gentle Letter to Yourself
      </Text>

      <Text
        size="lg"
        align="center"
        tone="accent"
        weight="medium"
        className="mb-4"
      >
        A PHOBIK practice in courage and kindness.
      </Text>

      <Text
        size="md"
        align="center"
        tone="secondary"
        className="mb-12 max-w-[320px] leading-relaxed"
      >
        A guided exercise in self-compassion. Through 5 gentle steps, replace
        harsh self-judgment with understanding and care.
      </Text>
    </Screen>
  );
}
