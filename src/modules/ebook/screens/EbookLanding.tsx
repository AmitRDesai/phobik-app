import landingHero from '@/assets/images/ebook/landing-hero.jpg';
import { BackButton } from '@/components/ui/BackButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ebookCompletedChaptersAtom,
  ebookIntroSeenAtom,
  ebookLastChapterAtom,
  ebookPurchasedAtom,
} from '../store/ebook-purchase';

export default function EbookLanding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [purchased, setPurchased] = useAtom(ebookPurchasedAtom);
  const [introSeen, setIntroSeen] = useAtom(ebookIntroSeenAtom);
  const [, setLastChapter] = useAtom(ebookLastChapterAtom);
  const [, setCompletedChapters] = useAtom(ebookCompletedChaptersAtom);

  const handleBuyNow = useCallback(async () => {
    const result = await dialog.info({
      title: 'Unlock Premium Access',
      message:
        'This will unlock the full Calm Above the Clouds journey including the E-Book and Quick Flight Checklist.\n\nNote: This requires in-app purchase to unlock.',
      buttons: [
        { label: 'Cancel', value: 'cancel', variant: 'secondary' },
        { label: 'Unlock', value: 'unlock', variant: 'primary' },
      ],
    });
    if (result === 'unlock') {
      setPurchased(true);
    }
  }, [setPurchased]);

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

  // TODO: Remove this — temporary reset for testing
  const handleReset = useCallback(() => {
    setPurchased(false);
    setIntroSeen(false);
    setLastChapter(null);
    setCompletedChapters([]);
  }, [setPurchased, setIntroSeen, setLastChapter, setCompletedChapters]);

  return (
    <View className="flex-1 bg-background-charcoal">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-2"
        style={{ paddingTop: insets.top + 8 }}
      >
        <BackButton icon="close" />
        {/* TODO: Remove — temporary reset for testing */}
        <Pressable
          onPress={handleReset}
          className="h-10 w-10 items-center justify-center"
        >
          <MaterialIcons name="refresh" size={22} color={colors.gray[500]} />
        </Pressable>
      </View>

      <ScrollFade fadeColor={colors.background.charcoal}>
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
                shadowColor: colors.gradient['hot-pink'],
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 60,
                elevation: 10,
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
            <Text className="pt-6 text-center text-[32px] font-bold leading-tight tracking-tight text-white">
              Calm Above the Clouds
            </Text>
          </View>

          {/* Subtitle */}
          <View className="px-8">
            <Text className="pb-6 pt-2 text-center text-lg leading-relaxed text-gray-400">
              The ultimate toolkit to transform flight anxiety into serenity.
            </Text>
          </View>

          {/* What's Included - only show before purchase */}
          {!purchased && (
            <View className="px-4">
              <Text className="border-b border-white/10 pb-3 pt-4 text-lg font-bold leading-tight tracking-tight text-white">
                {"What's included"}
              </Text>
            </View>
          )}

          {/* Items */}
          <View className="gap-3 p-4">
            {/* E-Book Item */}
            <Pressable
              onPress={handleEbookPress}
              disabled={!purchased}
              className="active:scale-[0.98]"
            >
              <View
                className="flex-row items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                style={purchased ? undefined : { opacity: 0.6 }}
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${colors.primary.pink}33`,
                  }}
                >
                  <MaterialIcons
                    name="menu-book"
                    size={28}
                    color={colors.primary.pink}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-white">
                    The Flight Mindfulness E-Book
                  </Text>
                  <Text className="text-sm text-gray-400">
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
              </View>
            </Pressable>

            {/* Checklist Item */}
            <Pressable
              onPress={handleChecklistPress}
              disabled={!purchased}
              className="active:scale-[0.98]"
            >
              <View
                className="flex-row items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                style={purchased ? undefined : { opacity: 0.6 }}
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${colors.primary.pink}33`,
                  }}
                >
                  <MaterialIcons
                    name="checklist"
                    size={28}
                    color={colors.primary.pink}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-white">
                    Quick Flight Checklist
                  </Text>
                  <Text className="text-sm text-gray-400">
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
              </View>
            </Pressable>
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
            <Text className="text-sm font-medium uppercase tracking-widest text-gray-400">
              Premium Access
            </Text>
            <Text className="text-xl font-bold text-white">$9.99</Text>
          </View>
          <View className="mt-3">
            <GradientButton
              onPress={handleBuyNow}
              prefixIcon={
                <MaterialIcons name="shopping-cart" size={20} color="white" />
              }
            >
              Buy Now
            </GradientButton>
          </View>
          <Text className="px-8 pb-2 pt-2 text-center text-[10px] text-gray-500">
            Restore purchase {'\u00b7'} Terms of Service {'\u00b7'} Privacy
            Policy
          </Text>
        </View>
      )}
    </View>
  );
}
