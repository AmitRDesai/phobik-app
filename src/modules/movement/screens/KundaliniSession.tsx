import kundaliniImg from '@/assets/images/four-pillars/movement-kundalini.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { useScheme } from '@/hooks/useTheme';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { MovementSessionShell } from './MovementSessionShell';

const DURATIONS = ['1 min', '3 min'];

const STEPS = [
  {
    icon: 'self-improvement' as const,
    title: 'Sit tall.',
    description: 'Find a firm seat, spine long like a thread of light.',
  },
  {
    icon: 'expand-less' as const,
    title: 'Inhale—lift your chest forward...',
    description: 'Arch the lower spine, heart opens toward the horizon.',
  },
  {
    icon: 'expand-more' as const,
    title: 'Exhale—round your spine back...',
    description: 'Contract the navel, tucking the chin slightly.',
  },
];

export default function KundaliniSession() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  const [duration, setDuration] = useState('3 min');
  const { heartRate } = useLatestBiometrics();

  return (
    <MovementSessionShell
      wordmark="Kundalini Spinal Flex"
      bottom={
        <View className="flex-row items-center justify-between">
          <Text size="xs" className="text-foreground/50">
            Feel the energy in your body
          </Text>
          <GradientButton compact onPress={() => {}}>
            Start
          </GradientButton>
        </View>
      }
    >
      <Card variant="glass">
        <Text size="h3" weight="extrabold">
          Kundalini Spinal Flex
        </Text>
        <Text size="sm" className="mt-1 text-foreground/70">
          Synchronize your movement with rhythmic exhales to unlock spinal
          energy.
        </Text>
      </Card>

      {/* Duration / Pace */}
      <View className="mt-4 flex-row gap-3">
        <Card variant="glass" className="flex-1 p-4">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="text-foreground/50"
          >
            Duration
          </Text>
          <View className="mt-3 flex-row gap-2">
            {DURATIONS.map((d) => {
              const active = d === duration;
              return (
                <Pressable
                  key={d}
                  onPress={() => setDuration(d)}
                  className={`rounded-full px-4 py-1.5 ${
                    active
                      ? 'bg-primary-pink'
                      : 'border border-foreground/10 bg-foreground/5'
                  }`}
                >
                  <Text
                    size="xs"
                    treatment="caption"
                    className={`font-bold ${active ? 'text-white' : 'text-foreground/70'}`}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
        <Card variant="glass" className="flex-1 p-4">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="text-foreground/50"
          >
            Pace
          </Text>
          <Text
            size="h1"
            weight="extrabold"
            className="mt-2"
            style={{ color: yellow }}
          >
            {heartRate ?? '—'}
          </Text>
          <Text size="xs" treatment="caption" className="text-foreground/50">
            BPM
          </Text>
        </Card>
      </View>

      {/* Hero with INHALE/EXHALE labels */}
      <View className="mt-6">
        <View className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="rotate-[-90deg] tracking-[0.4em] text-foreground/50"
          >
            Exhale
          </Text>
        </View>
        <View className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="rotate-90 tracking-[0.4em]"
            style={{ color: yellow }}
          >
            Inhale
          </Text>
        </View>
        <View
          className="overflow-hidden rounded-[28px] border border-foreground/10"
          style={{
            boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Image
            source={kundaliniImg}
            style={{ width: '100%', aspectRatio: 1 }}
            contentFit="cover"
          />
        </View>
      </View>

      {/* Steps accordion */}
      <View className="mt-6 gap-3">
        {STEPS.map((step) => (
          <Card
            key={step.title}
            variant="glass"
            className="flex-row items-start gap-3 p-4"
          >
            <MaterialIcons
              name={step.icon}
              size={18}
              color={colors.primary.pink}
            />
            <View className="flex-1">
              <Text size="lg" weight="bold">
                {step.title}
              </Text>
              <Text
                size="sm"
                className="mt-1 leading-relaxed text-foreground/70"
              >
                {step.description}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      <GradientText className="mt-6 text-center text-base">
        Let the breath lead the movement...
      </GradientText>
      <View className="h-6" />
    </MovementSessionShell>
  );
}
