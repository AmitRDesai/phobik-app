import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { IconChip } from '@/components/ui/IconChip';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors, withAlpha } from '@/constants/colors';
import { GradientText } from '@/components/ui/GradientText';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/themed/Text';
import { ScrollView, View } from 'react-native';
import { CREDIT_PLANS } from '../data/sound-studio';

const FAKE_BALANCE = 12;

const REASONS = [
  'Generate high-fidelity AI stems with 32-bit float precision.',
  'Render infinite variations of your sonic organism.',
  'Export commercial-ready masters with no royalty fees.',
];

export default function SoundStudioCredits() {
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
          <Text className="text-[36px] font-extrabold leading-tight tracking-tight text-foreground">
            Refill Your
          </Text>
          <GradientText className="text-[36px] font-extrabold leading-tight tracking-tight">
            Creativity
          </GradientText>
          <View className="mt-3 flex-row items-center gap-2">
            <MaterialIcons name="bolt" size={14} color={colors.accent.yellow} />
            <Text className="text-xs text-foreground/60">
              Current Balance:{' '}
              <Text className="font-bold text-foreground">
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
                    : 'border-foreground/10 bg-foreground/5'
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
                  <View className="absolute right-5 top-5 rounded-full bg-accent-yellow px-3 py-1">
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-on-primary-fixed">
                      Most Popular
                    </Text>
                  </View>
                ) : null}
                <IconChip size="lg" shape="rounded" tone="pink">
                  <MaterialIcons
                    name="auto-awesome"
                    size={20}
                    color={colors.primary.pink}
                  />
                </IconChip>
                <Text className="mt-4 text-2xl font-extrabold text-foreground">
                  {plan.name}
                </Text>
                <Text className="mt-1 text-xs text-foreground/60">
                  {plan.tagline}
                </Text>
                <View className="mt-4 flex-row items-baseline gap-2">
                  <Text className="text-4xl font-extrabold text-foreground">
                    {plan.credits}
                  </Text>
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                    Credits
                  </Text>
                </View>
                <Text className="mt-1 text-xl font-bold text-foreground">
                  {plan.price}
                </Text>
                <View className="mt-5">
                  {plan.popular ? (
                    <GradientButton
                      onPress={() => onPurchase(plan.name)}
                      icon={
                        <MaterialIcons name="bolt" size={16} color="white" />
                      }
                    >
                      Purchase Now
                    </GradientButton>
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
                        className="text-xs font-bold uppercase tracking-widest text-on-primary-fixed"
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
            <Text className="text-base font-bold text-foreground">
              Why use Credits?
            </Text>
            <View className="mt-3 gap-2">
              {REASONS.map((r) => (
                <View key={r} className="flex-row items-start gap-2">
                  <MaterialIcons
                    name="bolt"
                    size={14}
                    color={colors.accent.yellow}
                    style={{ marginTop: 2 }}
                  />
                  <Text className="flex-1 text-xs leading-relaxed text-foreground/70">
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
