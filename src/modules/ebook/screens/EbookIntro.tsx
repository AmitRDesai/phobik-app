import introHero from '@/assets/images/ebook/introduction-hero.jpg';
import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GradientButton } from '@/components/ui/GradientButton';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { RadialGlow } from '@/components/ui/RadialGlow';

import { ebookIntroSeenAtom } from '../store/ebook-purchase';

function GradientText({ text }: { text: string }) {
  return (
    <MaskedView
      maskElement={
        <Text className="text-4xl font-bold leading-tight tracking-tight">
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={[colors.primary.pink, colors.accent.yellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text className="text-4xl font-bold leading-tight tracking-tight opacity-0">
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function EbookIntro() {
  const router = useRouter();
  const setIntroSeen = useSetAtom(ebookIntroSeenAtom);

  const handleStartReading = useCallback(() => {
    setIntroSeen(true);
    router.replace('/practices/ebook-index');
  }, [setIntroSeen, router]);

  return (
    <Container safeAreaClass="bg-background-charcoal">
      {/* Background blur orbs — SVG radial gradient */}
      <RadialGlow
        color={colors.primary.pink}
        size={450}
        style={{ top: -80, right: -80 }}
      />
      <RadialGlow
        color={colors.primary.pink}
        size={450}
        style={{ top: '50%', left: -160 }}
      />

      {/* Top Navigation */}
      <View className="z-10 flex-row items-center justify-between px-6 pt-2">
        <BackButton />
        <View className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <Text className="text-xs font-medium uppercase tracking-widest text-white/70">
            Introduction
          </Text>
        </View>
        <View className="h-10 w-10" />
      </View>

      <ScrollFade fadeColor={colors.background.charcoal}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: FADE_HEIGHT,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          <View className="mt-4">
            <View
              className="relative overflow-hidden rounded-2xl border border-white/10"
              style={{ aspectRatio: 4 / 3 }}
            >
              <Image
                source={introHero}
                style={{ position: 'absolute', inset: 0 }}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', colors.background.charcoal]}
                start={{ x: 0.5, y: 0.4 }}
                end={{ x: 0.5, y: 1 }}
                style={{ position: 'absolute', inset: 0 }}
              />
              {/* Badge */}
              <View className="absolute bottom-4 left-4 z-20">
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Text className="text-[10px] font-bold uppercase tracking-tighter text-white">
                    Phobik Series
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Title */}
          <View className="mt-8">
            <Text className="text-4xl font-bold leading-tight tracking-tight text-white">
              A New Way to Understand and Work with the{' '}
            </Text>
            <GradientText text="Fear of Flying" />
            <View
              className="mt-4 h-1 w-12 rounded-full"
              style={{
                backgroundColor: colors.primary.pink,
              }}
            />
          </View>

          {/* Content */}
          <View className="mt-8 gap-6">
            <Text className="text-xl font-semibold text-white/90">
              Welcome to Calm Above the Clouds
            </Text>
            <Text className="text-lg italic leading-relaxed text-white/60">
              {
                '"This package is designed to help you navigate the skies with confidence. My personal journey through flight anxiety led to the creation of this two-part approach."'
              }
            </Text>

            <View className="gap-4 pt-4">
              {/* Intellectual Reassurance */}
              <View className="flex-row items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.primary.pink}33` }}
                >
                  <MaterialIcons
                    name="psychology"
                    size={22}
                    color={colors.primary.pink}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-white">
                    1. Intellectual Reassurance
                  </Text>
                  <Text className="mt-1 text-sm text-white/50">
                    Gaining a logical understanding of how aviation works to
                    dispel common myths and technical fears.
                  </Text>
                </View>
              </View>

              {/* Emotional Safety */}
              <View className="flex-row items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.primary.pink}33` }}
                >
                  <MaterialIcons
                    name="favorite"
                    size={22}
                    color={colors.primary.pink}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-white">
                    2. Emotional Safety
                  </Text>
                  <Text className="mt-1 text-sm text-white/50">
                    Nervous System Regulation via the Phobik app to manage the
                    physical symptoms of anxiety in real-time.
                  </Text>
                </View>
              </View>
            </View>

            <View className="pb-12 pt-6">
              <Text className="text-base leading-normal text-white/50">
                By combining logic with somatic tools, we address both the mind
                and the body, ensuring you feel supported from takeoff to
                landing.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScrollFade>

      {/* Bottom CTA */}
      <View className="z-10 px-6 pb-8">
        <GradientButton
          onPress={handleStartReading}
          icon={<MaterialIcons name="arrow-forward" size={20} color="white" />}
        >
          Start Reading
        </GradientButton>
      </View>
    </Container>
  );
}
