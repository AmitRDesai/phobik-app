import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, Text, View } from 'react-native';

import { EXERCISES } from '../data/exercises';
import { lazy8BreathingSessionAtom } from '../store/lazy-8-breathing';

const exercise = EXERCISES.find((e) => e.id === 'lazy-8-breathing')!;

export default function Lazy8BreathingIntro() {
  const router = useRouter();
  const [savedSession, setSavedSession] = useAtom(lazy8BreathingSessionAtom);
  const hasSavedSession = savedSession !== null;

  return (
    <Container safeAreaClass="bg-background-charcoal">
      <View className="flex-1 bg-background-charcoal">
        <GlowBg
          bgClassName="bg-background-charcoal"
          centerX={0.8}
          centerY={0.2}
          intensity={0.4}
          radius={0.4}
          startColor={colors.primary.pink}
          endColor={colors.accent.yellow}
        />

        {/* Close button — top-left */}
        <View className="absolute left-6 top-3 z-40">
          <BackButton />
        </View>

        {/* Main content — centered */}
        <View className="z-10 flex-1 items-center justify-center px-6 pb-32 pt-24">
          <View className="w-full max-w-md items-center">
            {/* Icon — rounded square with gradient */}
            <View className="relative mb-6">
              <LinearGradient
                colors={[colors.primary.pink, colors.accent.yellow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                }}
              >
                <MaterialIcons name="all-inclusive" size={36} color="white" />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text className="mb-4 text-center text-3xl font-bold tracking-tight text-white">
              Lazy 8 Breathing
            </Text>

            {/* Description */}
            <Text className="mx-auto mb-10 max-w-sm text-center text-[13px] leading-relaxed text-white/60">
              {exercise.description}
            </Text>

            {/* Buttons */}
            <View className="w-full gap-3">
              <GradientButton
                onPress={() =>
                  router.push('/practices/lazy-8-breathing-session')
                }
              >
                {hasSavedSession ? 'Resume Session' : 'Start'}
              </GradientButton>
              {hasSavedSession && (
                <Pressable
                  onPress={() => setSavedSession(null)}
                  className="w-full items-center rounded-full border border-white/5 bg-white/5 py-4 active:opacity-70"
                >
                  <Text className="text-sm font-medium text-white/60">
                    Restart Progress
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
}
