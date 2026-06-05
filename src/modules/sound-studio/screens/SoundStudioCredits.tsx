import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { AccentPill } from '@/components/ui/AccentPill';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { Header } from '@/components/ui/Header';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import {
  DEFAULT_CREDITS_PER_GENERATION,
  useCreditBalance,
  useCreditConfig,
} from '@/hooks/sound-generation';
import { useScheme } from '@/hooks/useTheme';
import { rpcClient } from '@/lib/rpc';
import { usePurchaseCredits } from '@/modules/purchases/hooks/usePurchaseCredits';
import { dialog } from '@/utils/dialog';
import { toast } from '@/utils/toast';
import { MaterialIcons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { useState } from 'react';
import { CREDIT_PLANS } from '../data/sound-studio';

const REASONS = [
  'Generate high-fidelity AI soundscapes from your own words.',
  'Render infinite variations of your sonic organism.',
  'Keep every creation in your personal library.',
];

// Dev-only test grant — pure, doesn't close over component state.
async function handleDevGrant() {
  try {
    await rpcClient.credits.devGrant({ amount: 50 });
    toast.success('Granted 50 test credits');
  } catch (err) {
    void dialog.error({
      title: 'Dev grant failed',
      message: err instanceof Error ? err.message : 'Try again.',
    });
  }
}

export default function SoundStudioCredits() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const { balance } = useCreditBalance();
  const { data: config } = useCreditConfig();
  const purchase = usePurchaseCredits();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Display from server config when available; fall back to static plans while
  // it loads. Purchasing needs the server productIds, so it's gated on config.
  const plans = config?.products ?? CREDIT_PLANS;
  const costPerSong =
    config?.creditsPerGeneration ?? DEFAULT_CREDITS_PER_GENERATION;

  const handlePurchase = async (planId: string) => {
    const product = config?.products.find((p) => p.id === planId);
    if (!product) {
      void dialog.info({
        title: 'One moment',
        message: 'Loading the store — try again in a second.',
      });
      return;
    }
    setPurchasingId(planId);
    try {
      const res = await purchase.mutateAsync({
        packId: product.id,
        productIds: product.productIds,
      });
      if (!res.cancelled) {
        toast.success('Purchase received — credits are on the way…');
      }
    } catch (err) {
      void dialog.error({
        title: 'Purchase failed',
        message:
          err instanceof Error ? err.message : 'Please try again in a moment.',
      });
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<Header variant="back" title="Sound Studio" />}
      className="px-screen-x pt-2"
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
            {balance} Credit{balance === 1 ? '' : 's'}
          </Text>
        </Text>
      </View>
      <Text size="xs" tone="tertiary" className="mt-1">
        Each song costs {costPerSong} credits.
      </Text>

      {/* Plans */}
      <View className="mt-6 gap-4">
        {plans.map((plan) => (
          <View
            key={plan.id}
            className={clsx(
              'rounded-3xl border p-6',
              plan.popular
                ? 'border-primary-pink/40 bg-primary-pink/5'
                : 'border-foreground/10 bg-foreground/[0.04]',
            )}
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
              {(color) => (
                <MaterialIcons name="auto-awesome" size={20} color={color} />
              )}
            </IconChip>
            <Text size="h2" weight="extrabold" className="mt-4">
              {plan.name}
            </Text>
            <Text size="xs" tone="secondary" className="mt-1">
              {plan.tagline}
            </Text>
            <View className="mt-4 flex-row items-baseline gap-2">
              <Text size="display" weight="extrabold">
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
            <Text size="xs" tone="secondary" className="mt-1">
              {Math.floor(plan.credits / costPerSong)} songs
            </Text>
            <Text size="lg" weight="bold" className="mt-2">
              {plan.price}
            </Text>
            <View className="mt-5">
              <Button
                onPress={() => handlePurchase(plan.id)}
                loading={purchasingId === plan.id}
                disabled={purchase.isPending}
                icon={<MaterialIcons name="bolt" size={16} color="white" />}
              >
                Purchase Now
              </Button>
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

      {/* Dev-only test grant */}
      {__DEV__ ? (
        <Button
          variant="ghost"
          size="sm"
          onPress={handleDevGrant}
          className="mt-4 self-center"
        >
          + Add 50 test credits (dev)
        </Button>
      ) : null}
    </Screen>
  );
}
