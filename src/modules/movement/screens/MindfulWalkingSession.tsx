import mindfulWalkingImg from '@/assets/images/four-pillars/movement-mindful-walking.jpg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { MovementSessionShell } from './MovementSessionShell';

const PHASES = [
  {
    number: '01',
    title: 'The Initiation',
    description:
      'Begin walking at a slow, natural pace... Let your arms hang loosely at your sides.',
  },
  {
    number: '02',
    title: 'Tactile Contact',
    description:
      'Feel your feet touch the ground. Heel... then toe... Notice the weight shift.',
  },
  {
    number: '03',
    title: 'Returning',
    description:
      'When your mind wanders, gently come back... The ground is always there, waiting for you.',
  },
];

export default function MindfulWalkingSession() {
  return (
    <MovementSessionShell
      wordmark="Mindful Walking"
      bottom={<GradientButton onPress={() => {}}>End Grounding</GradientButton>}
    >
      <View className="items-center pt-2">
        <View className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            Grounding Frequency Active
          </Text>
        </View>
      </View>

      {/* Hero image with title overlay */}
      <View className="mt-6 overflow-hidden rounded-[28px]">
        <View className="relative h-[200px]">
          <Image
            source={mindfulWalkingImg}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: 'absolute', inset: 0 }}
          />
          <View className="absolute inset-x-0 bottom-0 p-6">
            <Text className="text-2xl font-extrabold text-white">
              Mindful Walking:
            </Text>
            <Text className="text-2xl font-extrabold text-white">
              Feel each step.
            </Text>
          </View>
        </View>
      </View>

      {/* Phases */}
      <View className="mt-6 gap-3">
        {PHASES.map((phase) => (
          <View
            key={phase.number}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <Text className="text-[11px] font-bold tracking-widest text-accent-yellow">
              {phase.number}
            </Text>
            <Text className="mt-1 text-lg font-bold text-white">
              {phase.title}
            </Text>
            <Text className="mt-2 text-sm leading-relaxed text-white/70">
              {phase.description}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-8 items-center pb-4">
        <Text
          className="text-center text-base text-white/60"
          style={{ color: colors.accent.yellow }}
        >
          “You’re here. That’s enough.”
        </Text>
      </View>
    </MovementSessionShell>
  );
}
