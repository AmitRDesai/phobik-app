import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { type ReactNode } from 'react';

import { EXERCISES } from '../data/exercises';

interface ExerciseIntroScreenProps {
  exerciseId: string;
  sessionRoute: string;
  icon: ReactNode;
  hasSavedSession: boolean;
  onClearSession: () => void;
}

export function ExerciseIntroScreen({
  exerciseId,
  sessionRoute,
  icon,
  hasSavedSession,
  onClearSession,
}: ExerciseIntroScreenProps) {
  const router = useRouter();
  const exercise = EXERCISES.find((e) => e.id === exerciseId)!;

  return (
    <Screen
      variant="default"
      header={<Header left={<BackButton />} />}
      className="flex-1 items-center justify-center px-6"
    >
      <View className="w-full max-w-md items-center">
        <View className="relative mb-6">{icon}</View>

        <Text size="h1" align="center" className="mb-4">
          {exercise.name}
        </Text>

        <Text
          size="sm"
          tone="secondary"
          align="center"
          className="mx-auto mb-10 max-w-sm leading-relaxed"
        >
          {exercise.description}
        </Text>

        <View className="w-full gap-3">
          <GradientButton onPress={() => router.push(sessionRoute as never)}>
            {hasSavedSession ? 'Resume Session' : 'Start'}
          </GradientButton>
          {hasSavedSession && (
            <Button variant="ghost" onPress={onClearSession}>
              Restart Progress
            </Button>
          )}
        </View>
      </View>
    </Screen>
  );
}

/** Default gradient icon used by most intros */
export function GradientIcon({
  name,
  size = 36,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
}) {
  return (
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
        boxShadow: `0px 4px 20px ${withAlpha(colors.primary.pink, 0.4)}`,
      }}
    >
      <MaterialIcons name={name} size={size} color="white" />
    </LinearGradient>
  );
}
