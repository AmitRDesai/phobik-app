import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { alpha, colors } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slider } from '../components/Slider';
import { STRESSOR_CATEGORIES, type StressorKey } from '../data/stressors';
import { useSaveAnswer, useStartAssessment } from '../hooks/useSelfCheckIn';
import { stressorRatingsAtom } from '../store/self-check-ins';

export default function StressCompass() {
  const [ratings, setRatings] = useAtom(stressorRatingsAtom);
  const { width: screenWidth } = useWindowDimensions();
  const sliderWidth = screenWidth - 96;

  const startAssessment = useStartAssessment();
  const saveAnswer = useSaveAnswer();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startAssessment.mutate(
      { type: 'stress-compass' },
      {
        onSuccess: (result) => {
          const record = result as {
            id: string;
            answers?: Record<string, number>;
          };
          setAssessmentId(record.id);
          // Pre-seed ratings from any persisted answers (resume case)
          const answers = record.answers ?? {};
          if (Object.keys(answers).length > 0) {
            setRatings((prev) => {
              const next = { ...prev };
              for (const [qid, value] of Object.entries(answers)) {
                const idx = Number(qid);
                const stressor = STRESSOR_CATEGORIES[idx];
                if (stressor) next[stressor.key] = value;
              }
              return next;
            });
          }
        },
      },
    );
  }, []);

  const updateRating = useCallback(
    (key: StressorKey, value: number) => {
      setRatings((prev) => ({ ...prev, [key]: value }));
      if (!assessmentId) return;
      const questionId = STRESSOR_CATEGORIES.findIndex((s) => s.key === key);
      if (questionId < 0) return;
      saveAnswer.mutate({
        id: assessmentId,
        questionId,
        answer: value,
        currentQuestion: questionId,
      });
    },
    [setRatings, assessmentId, saveAnswer],
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      className="flex-1 bg-background"
    >
      {/* Header */}
      <View className="border-b border-foreground/5">
        <View className="flex-row items-center justify-between p-4">
          <BackButton />
          <View className="items-center">
            <Text className="text-[13px] font-bold uppercase tracking-[3px] text-foreground">
              Stress Compass
            </Text>
            <Text className="text-[10px] font-medium uppercase tracking-[4px] text-foreground/55">
              Assessment
            </Text>
          </View>
          <View className="size-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-8 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Section */}
        <View className="mb-10">
          <Text className="mb-4 text-3xl font-black leading-tight text-foreground">
            What is the Stress{'\n'}Compass?
          </Text>
          <Text className="mb-6 text-[15px] font-light leading-relaxed text-foreground/70">
            The Stress Compass helps you understand which areas of life are
            drawing the most energy from you right now. It is not about
            labelling you — it is about giving you insight into your nervous
            system patterns.
          </Text>
          <Card className="rounded-3xl p-5">
            <Text
              className="mb-2 text-[11px] font-black uppercase tracking-[3px]"
              style={{ color: colors.accent.yellow }}
            >
              How it works
            </Text>
            <Text className="text-sm leading-relaxed text-foreground/60">
              You will rate 10 core stressor categories on a scale of 1-10.{' '}
              <Text className="font-medium text-foreground">
                1 is {'"'}draining me{'"'}
              </Text>{' '}
              and{' '}
              <Text className="font-medium text-foreground">
                10 {'"'}feels balanced{'"'}
              </Text>
              . Your results create a {'"'}stress signature map{'"'} showing
              which nervous system pathways need support.
            </Text>
          </Card>
        </View>

        {/* Stressor Cards */}
        <View className="gap-4">
          {STRESSOR_CATEGORIES.map((stressor) => (
            <StressorCard
              key={stressor.key}
              label={stressor.label}
              icon={stressor.icon}
              value={ratings[stressor.key]}
              onValueChange={(v) => updateRating(stressor.key, v)}
              sliderWidth={sliderWidth}
            />
          ))}
        </View>

        {/* Bottom Quote */}
        <View className="items-center px-6 py-16">
          <Text className="max-w-[280px] text-center text-sm font-light italic leading-relaxed text-foreground/55">
            {'"'}This is not a test you can fail. It is a map to help you find
            your way back to yourself.{'"'}
          </Text>
          <View className="mt-8">
            <LinearGradient
              colors={['transparent', alpha.white20, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 48, height: 1 }}
            />
          </View>
        </View>

        {/* Generate Button (in-scroll) */}
        <GradientButton
          onPress={() =>
            router.replace({
              pathname: '/practices/self-check-ins/stress-signature-map',
              params: assessmentId ? { id: assessmentId } : {},
            })
          }
          icon={<MaterialIcons name="rocket-launch" size={20} color="white" />}
        >
          Generate My Map
        </GradientButton>
      </ScrollView>
    </SafeAreaView>
  );
}

interface StressorCardProps {
  label: string;
  icon: string;
  value: number;
  onValueChange: (v: number) => void;
  sliderWidth: number;
}

function StressorCard({
  label,
  icon,
  value,
  onValueChange,
  sliderWidth,
}: StressorCardProps) {
  return (
    <View className="rounded-[28px] border border-foreground/10 bg-surface p-6">
      {/* Header */}
      <View className="mb-5 flex-row items-center gap-4">
        <View className="size-10 items-center justify-center rounded-xl border border-foreground/5 bg-foreground/5">
          <MaterialIcons
            name={icon as keyof typeof MaterialIcons.glyphMap}
            size={20}
            color={colors.primary.pink}
          />
        </View>
        <Text className="text-base font-bold text-foreground">{label}</Text>
      </View>

      {/* Slider area */}
      <View>
        <View
          className="relative mb-3 items-center justify-center"
          style={{ height: 32 }}
        >
          {/* Gradient track background */}
          <View
            className="absolute overflow-hidden rounded-full bg-foreground/5"
            style={{ left: 8, right: 8, height: 6 }}
          >
            <LinearGradient
              colors={[colors.primary.pink, colors.accent.yellow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                opacity: 0.4,
              }}
            />
          </View>
          {/* Slider overlaid on track */}
          <View className="absolute" style={{ left: 0, right: 0 }}>
            <Slider
              value={value}
              min={1}
              max={10}
              onValueChange={onValueChange}
              trackWidth={sliderWidth}
              thumbBorderColor={colors.accent.yellow}
              maximumTrackColor="transparent"
            />
          </View>
        </View>

        {/* Labels */}
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-bold uppercase tracking-[2px] text-foreground/55">
            Draining
          </Text>
          <Text
            className="text-[10px] font-bold"
            style={{ color: colors.accent.yellow }}
          >
            Rating: {value}
          </Text>
          <Text className="text-[10px] font-bold uppercase tracking-[2px] text-foreground/55">
            Balanced
          </Text>
        </View>
      </View>
    </View>
  );
}
