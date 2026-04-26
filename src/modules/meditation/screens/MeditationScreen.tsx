import { GlowBg } from '@/components/ui/GlowBg';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { GradientText } from '@/modules/practices/components/GradientText';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { getMeditation } from '../data/meditations';

type MeditationScreenProps = {
  meditationId: string;
};

const FAKE_PROGRESS = 0.34;

/**
 * Unified meditation screen — single consistent template for all 10 meditations.
 * Layout:
 *  - Fixed top: PracticeStackHeader
 *  - Scrollable middle: hero image, eyebrow, title, meta, body, stats
 *  - Fixed bottom: progress bar, controls, footer actions
 */
export function MeditationScreen({ meditationId }: MeditationScreenProps) {
  const meditation = getMeditation(meditationId);
  const [isPlaying, setIsPlaying] = useState(false);
  const { heartRate, hrv } = useLatestBiometrics();

  if (!meditation) return null;

  const renderStatValue = (stat: {
    value: string;
    live?: 'heart_rate' | 'hrv';
  }): string => {
    if (!stat.live) return stat.value;
    if (stat.live === 'heart_rate') {
      return heartRate != null ? `${heartRate} BPM` : '— BPM';
    }
    return hrv != null ? `${Math.round(hrv)} ms` : '— ms';
  };

  const onTogglePlay = () => {
    void dialog.info({
      title: 'Coming soon',
      message: 'Audio playback will be available soon.',
    });
    setIsPlaying((p) => !p);
  };
  const onAction = (label: string) =>
    void dialog.info({
      title: label,
      message: 'Audio playback will be available soon.',
    });

  // Display-only times derived from the meditation duration.
  const totalDisplay = meditation.duration.replace(' min', ':00');
  const elapsedDisplay = '04:12';

  return (
    <View className="flex-1 bg-background-dark">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.25}
        radius={0.4}
        intensity={0.4}
        bgClassName="bg-background-dark"
      />
      <PracticeStackHeader wordmark="Meditation" />

      {/* Scrollable top content with bottom fade hint */}
      <ScrollFade fadeColor={colors.background.dark}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero image */}
          <View
            className="overflow-hidden rounded-[28px]"
            style={{
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.4,
              shadowRadius: 30,
            }}
          >
            <Image
              source={meditation.introImage}
              style={{ width: '100%', aspectRatio: 1.4 }}
              contentFit="cover"
            />
          </View>

          {/* Eyebrow pill */}
          {meditation.eyebrow ? (
            <View className="mt-6 self-start rounded-full border border-primary-pink/30 bg-primary-pink/10 px-3 py-1.5">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-pink">
                {meditation.eyebrow}
              </Text>
            </View>
          ) : (
            <View className="mt-6" />
          )}

          {/* Title */}
          <GradientText className="mt-3 text-[34px] font-extrabold leading-tight tracking-tight">
            {meditation.title}
          </GradientText>

          {/* Meta */}
          {meditation.meta ? (
            <Text className="mt-1 text-sm text-white/60">
              {meditation.meta}
            </Text>
          ) : null}

          {/* Body */}
          <View className="mt-6 gap-3">
            {meditation.body.map((p) => (
              <Text key={p} className="text-base leading-relaxed text-white/75">
                {p}
              </Text>
            ))}
          </View>

          {/* Stat cards */}
          {meditation.stats && meditation.stats.length > 0 ? (
            <View className="mt-6 flex-row gap-3">
              {meditation.stats.map((stat) => (
                <View
                  key={stat.label}
                  className="flex-1 rounded-3xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {stat.label}
                  </Text>
                  <Text className="mt-1 text-base font-bold text-white">
                    {renderStatValue(stat)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </ScrollFade>

      {/* Fixed bottom: progress + controls + footer */}
      <View className="border-t border-white/5 bg-background-dark/80 px-6 pb-8 pt-5">
        {/* Progress bar */}
        <View>
          <View className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 3, width: `${FAKE_PROGRESS * 100}%` }}
            />
          </View>
          <View className="mt-2 flex-row justify-between">
            <Text className="text-xs text-white/60">{elapsedDisplay}</Text>
            <Text className="text-xs text-white/60">{totalDisplay}</Text>
          </View>
        </View>

        {/* Controls */}
        <View className="mt-4 flex-row items-center justify-center gap-6">
          <Pressable
            onPress={() => onAction('Replay 10s')}
            className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
          >
            <MaterialIcons name="replay-10" size={22} color="white" />
          </Pressable>
          <Pressable
            onPress={onTogglePlay}
            className="h-20 w-20 items-center justify-center rounded-full active:scale-95"
            style={{
              shadowColor: colors.primary.pink,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 20,
            }}
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 9999,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={40}
                color="black"
              />
            </LinearGradient>
          </Pressable>
          <Pressable
            onPress={() => onAction('Forward 30s')}
            className="h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 active:scale-95"
          >
            <MaterialIcons name="forward-30" size={22} color="white" />
          </Pressable>
        </View>

        {/* Footer actions */}
        <View className="mt-5 flex-row justify-center gap-10">
          <Pressable
            onPress={() => onAction('Sleep timer')}
            className="items-center active:scale-95"
          >
            <MaterialIcons name="bedtime" size={20} color="white" />
            <Text className="mt-1 text-[10px] uppercase tracking-widest text-white/60">
              Sleep timer
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onAction('Save')}
            className="items-center active:scale-95"
          >
            <MaterialIcons name="favorite-border" size={20} color="white" />
            <Text className="mt-1 text-[10px] uppercase tracking-widest text-white/60">
              Save
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onAction('Share')}
            className="items-center active:scale-95"
          >
            <MaterialIcons name="ios-share" size={20} color="white" />
            <Text className="mt-1 text-[10px] uppercase tracking-widest text-white/60">
              Share
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
