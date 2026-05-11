import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { Screen } from '@/components/ui/Screen';
import { variantConfig } from '@/components/variant-config';
import { colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';

export default function EmpathyChallengeComplete() {
  const router = useRouter();
  const scheme = useScheme();
  const innerCircleBg = variantConfig.default[scheme].bgHex;

  return (
    <Screen
      variant="default"
      scroll
      header={
        <Header
          variant="close"
          center={
            <Text
              size="xs"
              treatment="caption"
              tone="secondary"
              numberOfLines={1}
            >
              Challenge Complete
            </Text>
          }
        />
      }
      sticky={
        <View className="gap-3 self-stretch">
          <GradientButton
            onPress={() => {
              // TODO: Share achievement
            }}
            prefixIcon={<MaterialIcons name="share" size={20} color="white" />}
          >
            Share Achievement
          </GradientButton>
          <Button
            variant="ghost"
            onPress={() => router.replace('/(tabs)/practices')}
          >
            Return to Home
          </Button>
        </View>
      }
      contentClassName="items-center px-6"
      className=""
    >
      <View className="relative mb-12 mt-8 items-center justify-center">
        <RadialGlow
          color={colors.primary.pink}
          size={400}
          style={{ top: -70, left: -70 }}
        />
        <LinearGradient
          colors={[
            colors.primary.pink,
            colors.primary.pink,
            colors.accent.yellow,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 256,
            height: 256,
            borderRadius: 128,
            padding: 3,
            boxShadow: `0 0 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <View
            className="flex-1 items-center justify-center rounded-full"
            style={{ backgroundColor: innerCircleBg }}
          >
            <MaterialIcons
              name="favorite"
              size={110}
              color={colors.primary['pink-soft']}
            />
          </View>
        </LinearGradient>
      </View>

      <Text size="display" className="mb-4">
        Empathy Master!
      </Text>
      <Text
        size="lg"
        align="center"
        className="max-w-[320px] leading-relaxed text-foreground/70"
      >
        You&apos;ve completed 7 days of growth. Your heart is more open, and
        your connections are stronger.
      </Text>

      <Card className="mt-10 w-full max-w-[180px] items-center gap-2 p-5">
        <MaterialIcons
          name="calendar-today"
          size={24}
          color={colors.primary.pink}
        />
        <Text size="xs" treatment="caption" tone="secondary">
          Sessions Done
        </Text>
        <Text size="h2">7/7</Text>
      </Card>

      <View className="mt-8 w-full gap-3 pb-8">
        <Text
          size="xs"
          treatment="caption"
          align="center"
          className="mb-1 tracking-[0.2em] text-foreground/45"
          style={{ paddingRight: 2.2 }}
        >
          Daily D.O.S.E. Reward
        </Text>
        <View className="flex-row gap-4">
          <Card className="flex-1 flex-row items-center justify-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-pink/15">
              <MaterialIcons
                name="favorite"
                size={18}
                color={colors.primary.pink}
              />
            </View>
            <View>
              <Text size="xs" treatment="caption" tone="secondary">
                Oxytocin
              </Text>
              <Text size="h3" weight="bold">
                +10
              </Text>
            </View>
          </Card>
          <Card className="flex-1 flex-row items-center justify-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-accent-info/15">
              <MaterialIcons
                name="psychology"
                size={18}
                color={colors.accent.info}
              />
            </View>
            <View>
              <Text size="xs" treatment="caption" tone="secondary">
                Serotonin
              </Text>
              <Text size="h3" weight="bold">
                +5
              </Text>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
