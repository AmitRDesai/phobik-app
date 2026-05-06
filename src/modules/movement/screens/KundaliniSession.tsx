import kundaliniImg from '@/assets/images/four-pillars/movement-kundalini.jpg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { useLatestBiometrics } from '@/modules/home/hooks/useLatestBiometrics';
import { GradientText } from '@/modules/practices/components/GradientText';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
  const [duration, setDuration] = useState('3 min');
  const { heartRate } = useLatestBiometrics();

  return (
    <MovementSessionShell
      wordmark="Kundalini Spinal Flex"
      bottom={
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs uppercase tracking-widest text-foreground/50">
              Feel the energy in your body
            </Text>
          </View>
          <View>
            <GradientButton compact onPress={() => {}}>
              Start
            </GradientButton>
          </View>
        </View>
      }
    >
      <View className="rounded-3xl border border-foreground/10 bg-foreground/5 p-5">
        <Text className="text-xl font-extrabold text-foreground">
          Kundalini Spinal Flex
        </Text>
        <Text className="mt-1 text-sm text-foreground/70">
          Synchronize your movement with rhythmic exhales to unlock spinal
          energy.
        </Text>
      </View>

      {/* Duration / Pace */}
      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-3xl border border-foreground/10 bg-foreground/5 p-4">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
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
                    className={`text-xs font-bold ${active ? 'text-on-primary-fixed' : 'text-foreground/70'}`}
                  >
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View className="flex-1 rounded-3xl border border-foreground/10 bg-foreground/5 p-4">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
            Pace
          </Text>
          <Text className="mt-2 text-3xl font-extrabold text-accent-yellow">
            {heartRate ?? '—'}
          </Text>
          <Text className="text-[10px] uppercase tracking-widest text-foreground/50">
            BPM
          </Text>
        </View>
      </View>

      {/* Hero with INHALE/EXHALE labels */}
      <View className="mt-6">
        <View className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
          <Text className="rotate-[-90deg] text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/50">
            Exhale
          </Text>
        </View>
        <View className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
          <Text className="rotate-90 text-[10px] font-bold uppercase tracking-[0.4em] text-accent-yellow">
            Inhale
          </Text>
        </View>
        <View
          className="overflow-hidden rounded-[28px] border border-foreground/10"
          style={{
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 24,
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
          <View
            key={step.title}
            className="flex-row items-start gap-3 rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
          >
            <MaterialIcons
              name={step.icon}
              size={18}
              color={colors.primary.pink}
            />
            <View className="flex-1">
              <Text className="text-base font-bold text-foreground">
                {step.title}
              </Text>
              <Text className="mt-1 text-sm leading-relaxed text-foreground/70">
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <GradientText className="mt-6 text-center text-base">
        Let the breath lead the movement...
      </GradientText>
      <View className="h-6" />
    </MovementSessionShell>
  );
}
