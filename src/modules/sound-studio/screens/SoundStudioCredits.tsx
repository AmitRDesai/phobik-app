import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Card } from '@/components/ui/Card';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { ScrollView } from 'react-native';

import { CREDIT_PLANS } from '../data/sound-studio';

const FAKE_BALANCE = 12;

const REASONS = [
  'Generate high-fidelity AI stems with 32-bit float precision.',
  'Render infinite variations of your sonic organism.',
  'Export commercial-ready masters with no royalty fees.',
];

export default function SoundStudioCredits() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');

  const onPurchase = (planName: string) =>
    dialog.info({
      title: 'Coming soon',
      message: `Purchasing the ${planName} plan will be available soon.`,
    });

  return (
    <View className="flex-1 bg-surface">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.25}
        radius={0.45}
        intensity={0.5}
        bgClassName="bg-surface"
      />
      <PracticeStackHeader wordmark="Sound Studio" />

      <ScrollFade>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-2 pb-12"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <Text size="display" className="leading-tight">
            Refill Your
          </Text>
          <GradientText className="text-[36px] font-extrabold leading-tight">
            Creativity
          </GradientText>
          <View className="mt-3 flex-row items-center gap-2">
            <MaterialIcons name="bolt" size={14} color={yellow} />
            <Text size="xs" tone="secondary">
              Current Balance:{' '}
              <Text size="xs" weight="bold">
                {FAKE_BALANCE} Credits
              </Text>
            </Text>
          </View>

          {/* Plans */}
          <View className="mt-6 gap-4">
            {CREDIT_PLANS.map((plan) => (
              <View
                key={plan.id}
                className={`rounded-3xl border p-6 ${
                  plan.popular
                    ? 'border-primary-pink/40 bg-primary-pink/5'
                    : 'border-foreground/10 bg-foreground/[0.04]'
                }`}
                style={
                  plan.popular
                    ? {
                        boxShadow: `0 0 24px ${withAlpha(colors.primary.pink, 0.3)}`,
                      }
                    : undefined
                }
              >
                {plan.popular ? (
                  <AccentPill
                    variant="solid"
                    tone="yellow"
                    label="Most Popular"
                    className="absolute right-5 top-5"
                  />
                ) : null}
                <IconChip size="lg" shape="rounded" tone="pink">
                  <MaterialIcons
                    name="auto-awesome"
                    size={20}
                    color={colors.primary.pink}
                  />
                </IconChip>
                <Text size="h2" weight="extrabold" className="mt-4">
                  {plan.name}
                </Text>
                <Text size="xs" tone="secondary" className="mt-1">
                  {plan.tagline}
                </Text>
                <View className="mt-4 flex-row items-baseline gap-2">
                  <Text weight="extrabold" className="text-4xl">
                    {plan.credits}
                  </Text>
                  <Text
                    size="xs"
                    treatment="caption"
                    tone="secondary"
                    weight="bold"
                  >
                    Credits
                  </Text>
                </View>
                <Text size="lg" weight="bold" className="mt-1">
                  {plan.price}
                </Text>
                <View className="mt-5">
                  {plan.popular ? (
                    <Button
                      onPress={() => onPurchase(plan.name)}
                      icon={
                        <MaterialIcons name="bolt" size={16} color="white" />
                      }
                    >
                      Purchase Now
                    </Button>
                  ) : (
                    <LinearGradient
                      colors={[colors.primary.pink, colors.accent.yellow]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 9999,
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        size="xs"
                        treatment="caption"
                        weight="bold"
                        className="text-on-primary-fixed"
                        onPress={() => onPurchase(plan.name)}
                      >
                        Purchase Now
                      </Text>
                    </LinearGradient>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Why use credits */}
          <Card className="mt-6 rounded-3xl p-5">
            <Text size="lg" weight="bold">
              Why use Credits?
            </Text>
            <View className="mt-3 gap-2">
              {REASONS.map((r) => (
                <View key={r} className="flex-row items-start gap-2">
                  <MaterialIcons
                    name="bolt"
                    size={14}
                    color={yellow}
                    style={{ marginTop: 2 }}
                  />
                  <Text
                    size="xs"
                    tone="secondary"
                    className="flex-1 leading-relaxed"
                  >
                    {r}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      </ScrollFade>
    </View>
  );
}
