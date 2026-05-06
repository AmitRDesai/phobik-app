import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text } from '@/components/themed/Text';
import { Pressable, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { Screen } from '@/components/ui/Screen';
import { variantConfig } from '@/components/variant-config';
import { colors } from '@/constants/colors';
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
              variant="caption"
              className="text-foreground/60"
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
          <Pressable
            onPress={() => router.replace('/(tabs)/practices')}
            className="w-full items-center rounded-full border border-foreground/10 bg-foreground/5 py-5"
          >
            <Text className="font-semibold text-foreground/80">
              Return to Home
            </Text>
          </Pressable>
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
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 60,
                spreadDistance: 10,
                color: 'rgba(238,43,140,0.4)',
              },
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 100,
                spreadDistance: 20,
                color: 'rgba(251,191,36,0.2)',
              },
            ],
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

      <Text className="mb-4 text-4xl font-bold text-foreground">
        Empathy Master!
      </Text>
      <Text className="max-w-[320px] text-center text-lg leading-relaxed text-foreground/70">
        You&apos;ve completed 7 days of growth. Your heart is more open, and
        your connections are stronger.
      </Text>

      <Card className="mt-10 w-full max-w-[180px] items-center gap-2 p-5">
        <MaterialIcons
          name="calendar-today"
          size={24}
          color={colors.primary.pink}
        />
        <Text variant="caption" className="text-foreground/55">
          Sessions Done
        </Text>
        <Text className="text-2xl font-bold text-foreground">7/7</Text>
      </Card>

      <View className="mt-8 w-full gap-3 pb-8">
        <Text variant="caption" className="mb-1 text-center text-foreground/45">
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
              <Text className="text-[9px] font-bold uppercase tracking-wider text-foreground/55">
                Oxytocin
              </Text>
              <Text className="text-lg font-bold text-foreground">+10</Text>
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
              <Text className="text-[9px] font-bold uppercase tracking-wider text-foreground/55">
                Serotonin
              </Text>
              <Text className="text-lg font-bold text-foreground">+5</Text>
            </View>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
