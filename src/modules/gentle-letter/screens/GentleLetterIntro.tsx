import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { GradientButton } from '@/components/ui/GradientButton';
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
            <Text variant="caption" className="font-bold text-foreground/55">
              Practice
            </Text>
          }
        />
      }
      sticky={
        <View>
          <GradientButton
            onPress={() => router.push('/practices/gentle-letter/write')}
          >
            Start My Letter
          </GradientButton>
          <Pressable
            onPress={() => router.push('/practices/gentle-letter/archive')}
            className="mt-4 flex-row items-center justify-center gap-2 py-2"
          >
            <MaterialIcons name="history" size={20} color={muted} />
            <Text variant="md" className="font-medium text-foreground/60">
              View Past Letters
            </Text>
          </Pressable>
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

      <Text variant="h1" className="mb-4 text-center font-bold leading-tight">
        Write a Gentle Letter to Yourself
      </Text>

      <Text
        variant="lg"
        className="mb-4 text-center font-medium text-primary-pink"
      >
        A PHOBIK practice in courage and kindness.
      </Text>

      <Text
        variant="md"
        className="mb-12 max-w-[320px] text-center leading-relaxed text-foreground/60"
      >
        A guided exercise in self-compassion. Through 5 gentle steps, replace
        harsh self-judgment with understanding and care.
      </Text>
    </Screen>
  );
}
