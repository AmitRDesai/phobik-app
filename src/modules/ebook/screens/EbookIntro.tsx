import introHero from '@/assets/images/ebook/introduction-hero.jpg';
import { ScrollView, Text, View } from '@/components/themed';
import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { RadialGlow } from '@/components/ui/RadialGlow';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdateEbookProgress } from '../hooks/useEbookProgress';

export default function EbookIntro() {
  const router = useRouter();
  const updateProgress = useUpdateEbookProgress();

  const handleStartReading = useCallback(() => {
    updateProgress.mutate({ introSeen: true });
    router.replace('/practices/ebook-index');
  }, [updateProgress, router]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-surface">
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
        <View className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1">
          <Text size="xs" treatment="caption" tone="secondary">
            Introduction
          </Text>
        </View>
        <View className="h-10 w-10" />
      </View>

      <ScrollFade>
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
              className="relative overflow-hidden rounded-2xl border border-foreground/10"
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
                  <Text size="xs" treatment="caption">
                    Phobik Series
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Title */}
          <View className="mt-8">
            <Text size="display" className="leading-tight">
              A New Way to Understand and Work with the{' '}
            </Text>
            <GradientText
              className="text-[36px] font-extrabold leading-[40px]"
              end={{ x: 1, y: 1 }}
            >
              Fear of Flying
            </GradientText>
            <View
              className="mt-4 h-1 w-12 rounded-full"
              style={{
                backgroundColor: colors.primary.pink,
              }}
            />
          </View>

          {/* Content */}
          <View className="mt-8 gap-6">
            <Text size="h3">Welcome to Calm Above the Clouds</Text>
            <Text size="lg" tone="secondary" italic className="leading-relaxed">
              {
                '"This package is designed to help you navigate the skies with confidence. My personal journey through flight anxiety led to the creation of this two-part approach."'
              }
            </Text>

            <View className="gap-4 pt-4">
              {/* Intellectual Reassurance */}
              <Card className="flex-row items-start gap-4">
                <IconChip
                  size="md"
                  shape="circle"
                  bg={withAlpha(colors.primary.pink, 0.2)}
                >
                  <MaterialIcons
                    name="psychology"
                    size={22}
                    color={colors.primary.pink}
                  />
                </IconChip>
                <View className="flex-1">
                  <Text size="md" weight="bold">
                    1. Intellectual Reassurance
                  </Text>
                  <Text size="sm" tone="secondary" className="mt-1">
                    Gaining a logical understanding of how aviation works to
                    dispel common myths and technical fears.
                  </Text>
                </View>
              </Card>

              {/* Emotional Safety */}
              <Card className="flex-row items-start gap-4">
                <IconChip
                  size="md"
                  shape="circle"
                  bg={withAlpha(colors.primary.pink, 0.2)}
                >
                  <MaterialIcons
                    name="favorite"
                    size={22}
                    color={colors.primary.pink}
                  />
                </IconChip>
                <View className="flex-1">
                  <Text size="md" weight="bold">
                    2. Emotional Safety
                  </Text>
                  <Text size="sm" tone="secondary" className="mt-1">
                    Nervous System Regulation via the Phobik app to manage the
                    physical symptoms of anxiety in real-time.
                  </Text>
                </View>
              </Card>
            </View>

            <View className="pb-12 pt-6">
              <Text size="md" tone="secondary" className="leading-relaxed">
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
    </SafeAreaView>
  );
}
