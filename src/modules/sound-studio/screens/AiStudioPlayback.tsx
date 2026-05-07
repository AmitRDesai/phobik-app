import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { IconChip } from '@/components/ui/IconChip';
import { Screen } from '@/components/ui/Screen';
import { colors, foregroundFor } from '@/constants/colors';
import { useScheme } from '@/hooks/useTheme';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable } from 'react-native';

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
  const scheme = useScheme();
  const fg = foregroundFor(scheme, 1);
  const [isPlaying, setIsPlaying] = useState(true);

  const onAction = (label: string) =>
    dialog.info({
      title: label,
      message: 'Audio playback will be available soon.',
    });

  return (
    <Screen
      variant="default"
      scroll
      header={<PracticeStackHeader wordmark="Aura Ai" />}
      className="px-6 pt-2"
    >
      {/* Hero copy */}
      <Text className="text-[32px] font-extrabold leading-tight">
        Ready to hear{' '}
        <GradientText className="text-[32px] font-extrabold leading-tight">
          your song?
        </GradientText>
      </Text>
      <Text variant="sm" muted className="mt-3">
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
                    i % 5 === 0 ? colors.primary.pink : 'rgba(255,255,255,0.6)',
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
        <Text variant="h2" className="font-extrabold">
          Neon Crystalline Pulse
        </Text>
        <Text variant="xs" muted className="mt-1">
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
          <Text variant="xs" muted>
            01:16
          </Text>
          <Text variant="xs" muted>
            05:44
          </Text>
        </View>

        {/* Controls + share */}
        <View className="mt-4 flex-row items-center gap-3">
          <Pressable
            onPress={() => onAction('Shuffle')}
            className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.04]"
          >
            <MaterialIcons name="shuffle" size={18} color={fg} />
          </Pressable>
          <Pressable
            onPress={() => onAction('Previous')}
            className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.04]"
          >
            <MaterialIcons name="skip-previous" size={20} color={fg} />
          </Pressable>
          <Pressable
            onPress={() => onAction('Next')}
            className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.04]"
          >
            <MaterialIcons name="skip-next" size={20} color={fg} />
          </Pressable>
          <Pressable
            onPress={() => onAction('Repeat')}
            className="h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-foreground/[0.04]"
          >
            <MaterialIcons name="repeat" size={18} color={fg} />
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
              <Text variant="caption" className="font-bold">
                Share
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* Your Creations */}
      <View className="mt-8">
        <View className="mb-3 flex-row items-baseline justify-between">
          <Text variant="caption" muted className="font-bold">
            Your Creations
          </Text>
          <Pressable onPress={() => onAction('View All')}>
            <Text variant="caption" className="text-primary-pink font-bold">
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
                <Text variant="sm" className="font-bold">
                  {c.title}
                </Text>
                <Text variant="xs" muted>
                  {c.meta}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Want more magic? */}
      <Card className="mt-6 p-5">
        <Text variant="lg" className="font-bold">
          Want more magic?
        </Text>
        <Text variant="xs" muted className="mt-1">
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
    </Screen>
  );
}
