import mindfulWalkingImg from '@/assets/images/four-pillars/movement-mindful-walking.jpg';
import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { useScheme } from '@/hooks/useTheme';
import { accentFor } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

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
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  return (
    <MovementSessionShell
      wordmark="Mindful Walking"
      bottom={<GradientButton onPress={() => {}}>End Grounding</GradientButton>}
    >
      <View className="items-center pt-2">
        <View className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5">
          <Text
            size="xs"
            treatment="caption"
            weight="bold"
            className="text-foreground/70"
          >
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
            <Text size="h2" tone="inverse" weight="extrabold">
              Mindful Walking:
            </Text>
            <Text size="h2" tone="inverse" weight="extrabold">
              Feel each step.
            </Text>
          </View>
        </View>
      </View>

      {/* Phases */}
      <View className="mt-6 gap-3">
        {PHASES.map((phase) => (
          <Card key={phase.number} variant="glass">
            <Text
              size="xs"
              treatment="caption"
              weight="bold"
              className="tracking-widest"
              style={{ color: yellow }}
            >
              {phase.number}
            </Text>
            <Text size="h3" weight="bold" className="mt-1">
              {phase.title}
            </Text>
            <Text size="sm" className="mt-2 leading-relaxed text-foreground/70">
              {phase.description}
            </Text>
          </Card>
        ))}
      </View>

      <View className="mt-8 items-center pb-4">
        <Text size="lg" align="center" style={{ color: yellow }}>
          “You’re here. That’s enough.”
        </Text>
      </View>
    </MovementSessionShell>
  );
}
