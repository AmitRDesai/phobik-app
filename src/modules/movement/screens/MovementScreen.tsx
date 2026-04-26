import { GlowBg } from '@/components/ui/GlowBg';
import { GradientButton } from '@/components/ui/GradientButton';
import { FADE_HEIGHT, ScrollFade } from '@/components/ui/ScrollFade';
import { colors } from '@/constants/colors';
import { GradientText } from '@/modules/practices/components/GradientText';
import { PracticeStackHeader } from '@/modules/practices/components/PracticeStackHeader';
import { dialog } from '@/utils/dialog';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

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
    <View className="flex-1 bg-background-dark">
      <GlowBg
        startColor={colors.primary.pink}
        endColor={colors.accent.yellow}
        centerY={0.2}
        radius={0.4}
        intensity={0.4}
        bgClassName="bg-background-dark"
      />
      <PracticeStackHeader wordmark="Movement" />

      <ScrollFade fadeColor={colors.background.dark}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-2"
          contentContainerStyle={{ paddingBottom: FADE_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          {/* Circular hero image */}
          <View className="items-center">
            <View
              className="h-[180px] w-[180px] overflow-hidden rounded-full border border-white/10"
              style={{
                shadowColor: colors.primary.pink,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 30,
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
            <Text className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
              {exercise.eyebrow}
            </Text>
          ) : null}

          {/* Title (italic, centered, optional gradient accent line) */}
          <View className="mt-3 items-center">
            <Text className="text-center text-[34px] font-extrabold leading-tight tracking-tight text-white">
              {exercise.title}
            </Text>
            {exercise.titleAccent ? (
              <GradientText className="text-center text-[34px] font-extrabold leading-tight tracking-tight">
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
                    className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
                  >
                    <MaterialIcons
                      name={i % 2 === 0 ? 'schedule' : 'favorite'}
                      size={12}
                      color={iconColor}
                    />
                    <Text
                      className={`text-[10px] font-bold uppercase tracking-widest ${tone}`}
                    >
                      {pill}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          {/* Body paragraphs in a glass card */}
          <View className="mt-6 gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
            {exercise.body.map((p) => (
              <Text key={p} className="text-base leading-relaxed text-white/80">
                {p}
              </Text>
            ))}
          </View>

          {/* Benefit cards */}
          {exercise.benefits && exercise.benefits.length > 0 ? (
            <View className="mt-4 gap-3">
              {exercise.benefits.map((b) => (
                <View
                  key={b.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5"
                >
                  <View className="mb-2 flex-row items-center gap-2">
                    <MaterialIcons
                      name={b.icon}
                      size={18}
                      color={colors.accent.yellow}
                    />
                    <Text className="text-base font-bold text-white">
                      {b.title}
                    </Text>
                  </View>
                  <Text className="text-sm leading-relaxed text-white/70">
                    {b.description}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Quote */}
          {exercise.quote ? (
            <Text className="mt-6 text-center text-sm leading-relaxed text-white/50">
              &ldquo;{exercise.quote}&rdquo;
            </Text>
          ) : null}

          {/* Stats */}
          {exercise.stats && exercise.stats.length > 0 ? (
            <View className="mt-6 flex-row gap-3">
              {exercise.stats.map((stat) => (
                <View
                  key={stat.label}
                  className="flex-1 rounded-3xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <Text className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {stat.label}
                  </Text>
                  <Text className="mt-1 text-base font-bold text-white">
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </ScrollView>
      </ScrollFade>

      {/* Fixed bottom: CTA + optional footer note */}
      <View className="border-t border-white/5 bg-background-dark/80 px-6 pb-8 pt-5">
        <GradientButton
          onPress={handleStart}
          icon={<MaterialIcons name="play-arrow" size={20} color="white" />}
        >
          Start Session
        </GradientButton>
        {exercise.footerNote ? (
          <Text className="mt-3 text-center text-[11px] uppercase tracking-widest text-white/50">
            {exercise.footerNote}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
