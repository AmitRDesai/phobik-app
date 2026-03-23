import { BackButton } from '@/components/ui/BackButton';
import Container from '@/components/ui/Container';
import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { Pressable, Text, View } from 'react-native';

import { EXERCISES } from '../data/exercises';
import { starBreathingSessionAtom } from '../store/star-breathing';

const exercise = EXERCISES.find((e) => e.id === 'star-breathing')!;

export default function StarBreathingIntro() {
  const router = useRouter();
  const [savedSession, setSavedSession] = useAtom(starBreathingSessionAtom);
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

        {/* Close button — top-left, glass pill style */}
        <View className="absolute left-6 top-3 z-40">
          <BackButton />
        </View>

        {/* Main content — centered */}
        <View className="z-10 flex-1 items-center justify-center px-6 pb-32 pt-24">
          <View className="w-full max-w-md items-center">
            {/* Star icon with glow */}
            <View className="relative mb-4 h-16 w-16 items-center justify-center">
              <View
                className="absolute h-16 w-16 rounded-full"
                style={{
                  backgroundColor: 'rgba(236,72,153,0.15)',
                  shadowColor: colors.primary.pink,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 30,
                }}
              />
              <MaterialIcons
                name="auto-awesome"
                size={36}
                color={colors.pink[400]}
              />
            </View>

            {/* Title */}
            <Text className="mb-3 text-center text-3xl font-bold tracking-tight text-white">
              Star Breathing
            </Text>

            {/* Description */}
            <Text className="mx-auto mb-6 max-w-sm text-center text-[13px] leading-relaxed text-white/60">
              {exercise.description}
            </Text>

            {/* Buttons */}
            <View className="w-full gap-3">
              <GradientButton
                onPress={() => router.push('/practices/star-breathing-session')}
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
