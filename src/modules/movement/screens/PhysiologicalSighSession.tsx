import { colors } from '@/constants/colors';
import { GradientText } from '@/modules/practices/components/GradientText';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

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
  return (
    <MovementSessionShell
      wordmark="Physiological Sigh"
      bottom={
        <View className="items-center">
          <Text className="text-lg font-bold text-accent-yellow">
            Notice the shift.
          </Text>
          <View className="mt-4 flex-row gap-2">
            <View className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            <View className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
          </View>
        </View>
      }
    >
      <View className="items-center pt-6">
        <Text className="text-2xl font-extrabold text-foreground">
          Physiological Sigh + Arm Raise
        </Text>
        <Text className="mt-2 text-xs uppercase tracking-widest text-foreground/60">
          Phase: Expansion
        </Text>
      </View>

      {/* Breathing circle */}
      <View className="mt-10 items-center">
        <View
          className="h-[220px] w-[220px] items-center justify-center rounded-full"
          style={{
            shadowColor: colors.primary.pink,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 30,
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
              <Text className="text-3xl font-extrabold text-foreground">
                4s
              </Text>
              <Text className="mt-1 text-[10px] uppercase tracking-widest text-foreground/70">
                Inhale
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Guided flow text cards */}
      <View className="mt-10 gap-3 pb-6">
        {STEPS.map((step) => (
          <View
            key={step.title}
            className={`flex-row items-start gap-4 rounded-3xl border border-foreground/10 bg-foreground/5 p-5 ${
              step.active ? '' : 'opacity-50'
            }`}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full border border-primary-pink/30 bg-primary-pink/10">
              <MaterialIcons
                name={step.icon}
                size={20}
                color={step.active ? colors.primary.pink : colors.accent.yellow}
              />
            </View>
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

      <GradientText className="mt-2 text-center text-base">
        — slow inhale, expand —
      </GradientText>
    </MovementSessionShell>
  );
}
