import { Text } from '@/components/themed/Text';
import { View } from '@/components/themed/View';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { GradientText } from '@/components/ui/GradientText';
import { Screen } from '@/components/ui/Screen';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { colors, withAlpha } from '@/constants/colors';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { getMovementExercise } from '../data/movement-exercises';

type MovementScreenProps = {
  exerciseId: string;
};

/**
 * Unified Movement intro screen — single consistent template for all 6 exercises.
 * Layout:
 *  - Fixed top: PracticeStackHeader (wordmark "Movement")
 *  - Scrollable middle: circular hero, eyebrow, title, pills, body, optional benefits/stats/quote
 *  - Fixed bottom: gradient CTA + optional footer note
 *
 * The session screens are not yet designed except for PMR. Begin shows a
 * "Coming soon" dialog for the other 5.
 */
export function MovementScreen({ exerciseId }: MovementScreenProps) {
  const router = useRouter();
  const exercise = getMovementExercise(exerciseId);

  if (!exercise) return null;

  const handleStart = () => {
    if (exercise.sessionRoute) {
      router.push(exercise.sessionRoute);
    } else {
      void dialog.info({
        title: 'Coming soon',
        message:
          'The guided session for this practice is being prepared. Check back soon.',
      });
    }
  };

  return (
    <Screen
      variant="default"
      scroll
      header={<PracticeStackHeader wordmark="Movement" />}
      sticky={
        <View className="border-t border-foreground/5 px-2 pt-3">
          <GradientButton
            onPress={handleStart}
            icon={<MaterialIcons name="play-arrow" size={20} color="white" />}
          >
            Start Session
          </GradientButton>
          {exercise.footerNote ? (
            <Text size="xs" align="center" className="mt-3 text-foreground/50">
              {exercise.footerNote}
            </Text>
          ) : null}
        </View>
      }
      className="px-6 pt-4"
    >
      {/* Circular hero image */}
      <View className="items-center">
        <View
          className="h-[180px] w-[180px] overflow-hidden rounded-full border border-foreground/10"
          style={{
            boxShadow: `0px 0px 12px ${withAlpha(colors.primary.pink, 0.2)}`,
          }}
        >
          <Image
            source={exercise.introImage}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        </View>
      </View>

      {/* Eyebrow */}
      {exercise.eyebrow ? (
        <Text
          size="xs"
          treatment="caption"
          align="center"
          weight="bold"
          className="mt-6 tracking-[0.3em] text-foreground/60"
        >
          {exercise.eyebrow}
        </Text>
      ) : null}

      {/* Title (centered, optional gradient accent line) */}
      <View className="mt-3 items-center">
        <Text
          align="center"
          weight="extrabold"
          className="text-[34px] leading-[1.1]"
        >
          {exercise.title}
        </Text>
        {exercise.titleAccent ? (
          <GradientText className="text-center text-[34px] font-extrabold leading-[1.1]">
            {exercise.titleAccent}
          </GradientText>
        ) : null}
      </View>

      {/* Pills */}
      {exercise.pills && exercise.pills.length > 0 ? (
        <View className="mt-4 flex-row justify-center gap-3">
          {exercise.pills.map((pill, i) => {
            const tone =
              i % 2 === 0 ? 'text-primary-pink' : 'text-accent-yellow';
            const iconColor =
              i % 2 === 0 ? colors.primary.pink : colors.accent.yellow;
            return (
              <View
                key={pill}
                className="flex-row items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5"
              >
                <MaterialIcons
                  name={i % 2 === 0 ? 'schedule' : 'favorite'}
                  size={12}
                  color={iconColor}
                />
                <Text
                  size="xs"
                  treatment="caption"
                  className={`font-bold ${tone}`}
                >
                  {pill}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      {/* Body paragraphs in a glass card */}
      <Card variant="glass" className="mt-6 gap-3">
        {exercise.body.map((p) => (
          <Text
            key={p}
            size="lg"
            className="leading-relaxed text-foreground/80"
          >
            {p}
          </Text>
        ))}
      </Card>

      {/* Benefit cards */}
      {exercise.benefits && exercise.benefits.length > 0 ? (
        <View className="mt-4 gap-3">
          {exercise.benefits.map((b) => (
            <Card key={b.title} variant="glass">
              <View className="mb-2 flex-row items-center gap-2">
                <MaterialIcons
                  name={b.icon}
                  size={18}
                  color={colors.accent.yellow}
                />
                <Text size="lg" weight="bold">
                  {b.title}
                </Text>
              </View>
              <Text size="sm" className="leading-relaxed text-foreground/70">
                {b.description}
              </Text>
            </Card>
          ))}
        </View>
      ) : null}

      {/* Quote */}
      {exercise.quote ? (
        <Text
          size="sm"
          align="center"
          className="mt-6 leading-relaxed text-foreground/50"
        >
          &ldquo;{exercise.quote}&rdquo;
        </Text>
      ) : null}

      {/* Stats */}
      {exercise.stats && exercise.stats.length > 0 ? (
        <View className="mt-6 flex-row gap-3">
          {exercise.stats.map((stat) => (
            <Card key={stat.label} variant="glass" className="flex-1 px-4 py-3">
              <Text
                size="xs"
                treatment="caption"
                weight="bold"
                className="text-foreground/50"
              >
                {stat.label}
              </Text>
              <Text size="lg" weight="bold" className="mt-1">
                {stat.value}
              </Text>
            </Card>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
