import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlowBg } from '@/components/ui/GlowBg';
import { IconChip } from '@/components/ui/IconChip';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { GradientText } from '@/components/ui/GradientText';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from '@/components/themed/Text';
import { Pressable, ScrollView, View } from 'react-native';
const CREATIONS = [
  {
    id: 'cyberpunk-rain',
    title: 'Cyberpunk Rain',
    meta: 'Oct 13, 2026 • 4:12',
  },
  {
    id: 'ethereal-clouds',
    title: 'Ethereal Clouds',
    meta: 'Oct 11, 2026 • 5:21',
  },
  {
    id: 'deep-void-techno',
    title: 'Deep Void Techno',
    meta: 'Oct 06, 2026 • 6:13',
  },
];

const PROGRESS = 0.16;

export default function AiStudioPlayback() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);

  const onAction = (label: string) =>
    dialog.info({
      title: label,
      message: 'Audio playback will be available soon.',
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
      <PracticeStackHeader wordmark="Aura Ai" />

      <ScrollFade>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-2"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero copy */}
          <Text className="text-[32px] font-extrabold leading-tight tracking-tight text-foreground">
            Ready to hear{' '}
            <GradientText className="text-[32px] font-extrabold leading-tight tracking-tight">
              your song?
            </GradientText>
          </Text>
          <Text className="mt-3 text-sm text-foreground/60">
            AI-generated from your prompt: "A rhythmic neon pulse through a
            crystalline forest at midnight."
          </Text>

          {/* Visualizer card */}
          <View className="mt-6 overflow-hidden rounded-3xl border border-foreground/10">
            <LinearGradient
              colors={['#1a0a14', '#3a0e26']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20 }}
            >
              {/* Fake EQ bars */}
              <View className="h-[140px] flex-row items-end justify-center gap-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <View
                    key={`eq-${i}`}
                    className="w-2 rounded-full"
                    style={{
                      height: 20 + Math.abs(Math.sin(i * 0.7)) * 90,
                      backgroundColor:
                        i % 5 === 0
                          ? colors.primary.pink
                          : 'rgba(255,255,255,0.6)',
                    }}
                  />
                ))}
              </View>

              {/* Centered play */}
              <View className="-mt-[90px] items-center">
                <Pressable
                  onPress={() => setIsPlaying((p) => !p)}
                  className="active:scale-95"
                >
                  <LinearGradient
                    colors={[colors.primary.pink, colors.accent.yellow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 9999,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialIcons
                      name={isPlaying ? 'pause' : 'play-arrow'}
                      size={32}
                      color="black"
                    />
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>

          {/* Track meta */}
          <View className="mt-5">
            <Text className="text-xl font-extrabold text-foreground">
              Neon Crystalline Pulse
            </Text>
            <Text className="mt-1 text-xs text-foreground/50">
              BPM: 124 • Key: F# Minor
            </Text>

            {/* Progress bar */}
            <View className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 3, width: `${PROGRESS * 100}%` }}
              />
            </View>
            <View className="mt-2 flex-row justify-between">
              <Text className="text-[10px] text-foreground/50">01:16</Text>
              <Text className="text-[10px] text-foreground/50">05:44</Text>
            </View>

            {/* Controls + share */}
            <View className="mt-4 flex-row items-center gap-3">
              <Pressable
                onPress={() => onAction('Shuffle')}
                className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
              >
                <MaterialIcons name="shuffle" size={18} color="white" />
              </Pressable>
              <Pressable
                onPress={() => onAction('Previous')}
                className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
              >
                <MaterialIcons name="skip-previous" size={20} color="white" />
              </Pressable>
              <Pressable
                onPress={() => onAction('Next')}
                className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
              >
                <MaterialIcons name="skip-next" size={20} color="white" />
              </Pressable>
              <Pressable
                onPress={() => onAction('Repeat')}
                className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5"
              >
                <MaterialIcons name="repeat" size={18} color="white" />
              </Pressable>
              <View className="flex-1" />
              <Pressable
                onPress={() => onAction('Share to Community')}
                className="active:scale-95"
              >
                <LinearGradient
                  colors={[colors.primary.pink, colors.accent.yellow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 9999,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <MaterialIcons name="ios-share" size={14} color="white" />
                  <Text variant="caption" className="text-foreground">
                    Share
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Your Creations */}
          <View className="mt-8">
            <View className="mb-3 flex-row items-baseline justify-between">
              <Text variant="caption" className="text-foreground/60">
                Your Creations
              </Text>
              <Pressable onPress={() => onAction('View All')}>
                <Text variant="caption" className="text-primary-pink">
                  View All
                </Text>
              </Pressable>
            </View>
            <View className="gap-2">
              {CREATIONS.map((c) => (
                <Card
                  key={c.id}
                  onPress={() => onAction(c.title)}
                  className="flex-row items-center gap-3 p-3"
                >
                  <IconChip size="md" shape="rounded" tone="pink">
                    <MaterialIcons
                      name="graphic-eq"
                      size={18}
                      color={colors.primary.pink}
                    />
                  </IconChip>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground">
                      {c.title}
                    </Text>
                    <Text className="text-[11px] text-foreground/50">
                      {c.meta}
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          </View>

          {/* Want more magic? */}
          <Card className="mt-6 p-5">
            <Text className="text-base font-bold text-foreground">
              Want more magic?
            </Text>
            <Text className="mt-1 text-xs text-foreground/60">
              Start a new session and create something unique today.
            </Text>
            <View className="mt-4">
              <GradientButton
                compact
                onPress={() => router.push('/sound-studio/ai/write')}
                icon={
                  <MaterialIcons name="arrow-forward" size={14} color="white" />
                }
              >
                New Studio Session
              </GradientButton>
            </View>
          </Card>
        </ScrollView>
      </ScrollFade>
    </View>
  );
}
