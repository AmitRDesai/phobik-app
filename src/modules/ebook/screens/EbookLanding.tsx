import landingHero from '@/assets/images/ebook/landing-hero.jpg';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { IconChip } from '@/components/ui/IconChip';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors, withAlpha } from '@/constants/colors';
import { usePackOffering } from '@/modules/purchases/hooks/usePackOffering';
import { usePackPurchased } from '@/modules/purchases/hooks/usePackPurchased';
import { usePurchasePack } from '@/modules/purchases/hooks/usePurchasePack';
import { useRestorePurchases } from '@/modules/purchases/hooks/useRestorePurchases';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useEbookProgress } from '../hooks/useEbookProgress';

const PACK_ID = 'fear-of-flying';

export default function EbookLanding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: progress } = useEbookProgress();
  const purchased = usePackPurchased(PACK_ID);
  const { introSeen } = progress;
  const purchasePack = usePurchasePack();
  const restorePurchases = useRestorePurchases();
  const { data: offering } = usePackOffering(PACK_ID);

  const handleBuyNow = useCallback(async () => {
    try {
      await purchasePack.mutateAsync(PACK_ID);
      dialog.info({
        title: 'Purchase Successful',
        message:
          'You now have full access to Calm Above the Clouds, including the E-Book and Quick Flight Checklist.',
      });
    } catch (error: unknown) {
      // RevenueCat sets userCancelled on cancellation — not an error
      if (
        error instanceof Error &&
        'userCancelled' in error &&
        (error as { userCancelled: boolean }).userCancelled
      ) {
        return;
      }
      dialog.error({
        title: 'Purchase Failed',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      });
    }
  }, [purchasePack]);

  const handleRestore = useCallback(async () => {
    try {
      const close = dialog.loading({ message: 'Restoring purchases...' });
      const result = await restorePurchases.mutateAsync();
      close();
      if (result.restoredCount > 0) {
        dialog.info({
          title: 'Purchases Restored',
          message: 'Your purchases have been restored successfully.',
        });
      } else {
        dialog.info({
          title: 'No Purchases Found',
          message: 'No previous purchases were found for this account.',
        });
      }
    } catch {
      dialog.error({
        title: 'Restore Failed',
        message: 'Could not restore purchases. Please try again.',
      });
    }
  }, [restorePurchases]);

  const handleEbookPress = useCallback(() => {
    if (!purchased) return;
    if (introSeen) {
      router.push('/practices/ebook-index');
    } else {
      router.push('/practices/ebook-intro');
    }
  }, [purchased, introSeen, router]);

  const handleChecklistPress = useCallback(() => {
    if (!purchased) return;
    router.push('/practices/flight-checklist-hub');
  }, [purchased, router]);

  const priceLabel = offering?.priceString ?? '$9.99';
  const isPurchasing = purchasePack.isPending;

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-2"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton icon="close" />
      </View>

      <ScrollFade>
        <ScrollView
          contentContainerClassName="pb-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: FADE_HEIGHT,
          }}
        >
          {/* Hero Image */}
          <View className="px-4 py-3">
            <View
              className="relative overflow-hidden rounded-xl"
              style={{
                aspectRatio: 4 / 5,
                boxShadow: `0px 0px 60px ${withAlpha(colors.gradient['hot-pink'], 0.15)}`,
              }}
            >
              <Image
                source={landingHero}
                style={{ position: 'absolute', inset: 0 }}
                contentFit="cover"
              />
              {/* Bottom gradient overlay */}
              <LinearGradient
                colors={['transparent', colors.background.charcoal]}
                start={{ x: 0.5, y: 0.4 }}
                end={{ x: 0.5, y: 1 }}
                style={{ position: 'absolute', inset: 0, opacity: 0.8 }}
              />
              {/* Pink top overlay */}
              <LinearGradient
                colors={[`${colors.primary.pink}33`, 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.5 }}
                style={{ position: 'absolute', inset: 0 }}
              />
            </View>
          </View>

          {/* Title */}
          <View className="px-4">
            <Text className="pt-6 text-center text-[32px] font-bold leading-tight tracking-tight text-foreground">
              Calm Above the Clouds
            </Text>
          </View>

          {/* Subtitle */}
          <View className="px-8">
            <Text className="pb-6 pt-2 text-center text-lg leading-relaxed text-foreground/60">
              The ultimate toolkit to transform flight anxiety into serenity.
            </Text>
          </View>

          {/* What's Included - only show before purchase */}
          {!purchased && (
            <View className="px-4">
              <Text className="border-b border-foreground/10 pb-3 pt-4 text-lg font-bold leading-tight tracking-tight text-foreground">
                {"What's included"}
              </Text>
            </View>
          )}

          {/* Items */}
          <View className="gap-3 p-4">
            {/* E-Book Item */}
            <Card
              onPress={purchased ? handleEbookPress : undefined}
              disabled={!purchased}
              className="flex-row items-center gap-4"
              style={purchased ? undefined : { opacity: 0.6 }}
            >
              <IconChip
                size="lg"
                shape="rounded"
                bg={withAlpha(colors.primary.pink, 0.2)}
              >
                <MaterialIcons
                  name="menu-book"
                  size={28}
                  color={colors.primary.pink}
                />
              </IconChip>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  The Flight Mindfulness E-Book
                </Text>
                <Text className="text-sm text-foreground/60">
                  Step-by-step techniques for grounding
                </Text>
              </View>
              {purchased && (
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={colors.gray[600]}
                />
              )}
            </Card>

            {/* Checklist Item */}
            <Card
              onPress={purchased ? handleChecklistPress : undefined}
              disabled={!purchased}
              className="flex-row items-center gap-4"
              style={purchased ? undefined : { opacity: 0.6 }}
            >
              <IconChip
                size="lg"
                shape="rounded"
                bg={withAlpha(colors.primary.pink, 0.2)}
              >
                <MaterialIcons
                  name="checklist"
                  size={28}
                  color={colors.primary.pink}
                />
              </IconChip>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">
                  Quick Flight Checklist
                </Text>
                <Text className="text-sm text-foreground/60">
                  Your companion for boarding and takeoff
                </Text>
              </View>
              {purchased && (
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={colors.gray[600]}
                />
              )}
            </Card>
          </View>
        </ScrollView>
      </ScrollFade>

      {/* Bottom CTA - normal flow below ScrollFade */}
      {!purchased && (
        <View
          className="z-10 px-4"
          style={{ paddingBottom: insets.bottom + 8 }}
        >
          <View className="flex-row items-center justify-between px-2">
            <Text className="text-sm font-medium uppercase tracking-widest text-foreground/60">
              Premium Access
            </Text>
            <Text className="text-xl font-bold text-foreground">
              {priceLabel}
            </Text>
          </View>
          <View className="mt-3">
            <GradientButton
              onPress={handleBuyNow}
              disabled={isPurchasing}
              prefixIcon={
                isPurchasing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="shopping-cart" size={20} color="white" />
                )
              }
            >
              {isPurchasing ? 'Processing...' : 'Buy Now'}
            </GradientButton>
          </View>
          <View className="flex-row items-center justify-center gap-1 px-8 pb-2 pt-2">
            <Pressable onPress={handleRestore}>
              <Text className="text-[10px] text-foreground/55 underline">
                Restore purchase
              </Text>
            </Pressable>
            <Text className="text-[10px] text-foreground/55">{'\u00b7'}</Text>
            <Text className="text-[10px] text-foreground/55">
              Terms of Service
            </Text>
            <Text className="text-[10px] text-foreground/55">{'\u00b7'}</Text>
            <Text className="text-[10px] text-foreground/55">
              Privacy Policy
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
