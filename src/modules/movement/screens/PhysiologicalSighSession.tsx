import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { useScheme } from '@/hooks/useTheme';
import { accentFor, colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { MovementSessionShell } from './MovementSessionShell';

const STEPS = [
  {
    icon: 'air' as const,
    title: 'Slow inhale...',
    description:
      'Fill your lungs steadily while raising your hands toward the sky.',
    active: true,
  },
  {
    icon: 'add-circle' as const,
    title: 'Take a second short inhale...',
    description: 'A quick top-off to fully pop the alveoli in your lungs.',
    active: false,
  },
];

export default function PhysiologicalSighSession() {
  const scheme = useScheme();
  const yellow = accentFor(scheme, 'yellow');
  return (
    <MovementSessionShell
      wordmark="Physiological Sigh"
      bottom={
        <View className="items-center">
          <Text variant="lg" className="font-bold" style={{ color: yellow }}>
            Notice the shift.
          </Text>
          <View className="mt-4 flex-row gap-2">
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: yellow }}
            />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
          </View>
        </View>
      }
    >
      <View className="items-center pt-6">
        <Text variant="h2" className="font-extrabold">
          Physiological Sigh + Arm Raise
        </Text>
        <Text variant="xs" className="mt-2 text-foreground/60">
          Phase: Expansion
        </Text>
      </View>

      {/* Breathing circle */}
      <View className="mt-10 items-center">
        <View
          className="h-[220px] w-[220px] items-center justify-center rounded-full"
          style={{
            boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <LinearGradient
            colors={[colors.primary.pink, colors.accent.yellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 220,
              height: 220,
              borderRadius: 9999,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View className="h-[200px] w-[200px] items-center justify-center rounded-full border border-foreground/20 bg-surface/40">
              <Text variant="h1" className="font-extrabold">
                4s
              </Text>
              <Text variant="caption" className="mt-1 text-foreground/70">
                Inhale
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Guided flow text cards */}
      <View className="mt-10 gap-3 pb-6">
        {STEPS.map((step) => (
          <Card
            key={step.title}
            variant="glass"
            className={`flex-row items-start gap-4 ${
              step.active ? '' : 'opacity-50'
            }`}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10">
              <MaterialIcons
                name={step.icon}
                size={20}
                color={step.active ? colors.primary.pink : yellow}
              />
            </View>
            <View className="flex-1">
              <Text variant="lg" className="font-bold">
                {step.title}
              </Text>
              <Text
                variant="sm"
                className="mt-1 leading-relaxed text-foreground/70"
              >
                {step.description}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      <GradientText className="mt-2 text-center text-base">
        — slow inhale, expand —
      </GradientText>
    </MovementSessionShell>
  );
}
