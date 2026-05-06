import { BackButton } from '@/components/ui/BackButton';
import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors, withAlpha } from '@/constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { INTIMACY_QUESTIONS } from '../data/intimacy-questions';
import { intimacyAnswersAtom } from '../store/self-check-ins';

const RING_SIZE = 140;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface ScoreRingProps {
  score: number;
  max: number;
  label: string;
  labelColor: string;
  gradientId: string;
}

function ScoreRing({
  score,
  max,
  label,
  labelColor,
  gradientId,
}: ScoreRingProps) {
  const percentage = max > 0 ? (score / max) * 100 : 0;
  const strokeDashoffset =
    RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * percentage) / 100;

  return (
    <View className="flex-1 items-center">
      <View
        className="relative items-center justify-center"
        style={{ width: RING_SIZE, height: RING_SIZE }}
      >
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.primary.pink} />
              <Stop offset="1" stopColor={colors.accent.yellow} />
            </LinearGradient>
          </Defs>
          {/* Background ring */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={RING_STROKE}
            fill="none"
          />
          {/* Progress ring */}
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            stroke={`url(#${gradientId})`}
            strokeWidth={RING_STROKE}
            fill="none"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <View className="absolute items-center">
          <Text className="text-3xl font-bold text-foreground">{score}</Text>
          <Text className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/55">
            / {max}
          </Text>
        </View>
      </View>
      <Text
        className="mt-4 text-xs font-bold uppercase tracking-wider"
        style={{ color: labelColor }}
      >
        {label}
      </Text>
    </View>
  );
}

interface InsightContent {
  title: string;
  body: string;
}

function getInsight(speakerPct: number, listenerPct: number): InsightContent {
  const diff = speakerPct - listenerPct;

  if (speakerPct >= 75 && listenerPct >= 75) {
    return {
      title: 'Balanced Mastery',
      body: 'You bring strength to both expression and reception. Keep nurturing this balance — it’s the foundation of deep, lasting intimacy.',
    };
  }

  if (diff >= 15) {
    return {
      title: 'Strong Voice, Growing Ear',
      body: 'Your results show a natural inclination towards sharing, but a potential gap in receptive connection. Strengthening your listening role will help harmonize your relationships and build deeper trust.',
    };
  }

  if (diff <= -15) {
    return {
      title: 'Deep Listener, Emerging Voice',
      body: 'You bring strong receptive presence to your relationships. Practicing how to express your own needs and feelings will let your partner meet you with the same care you offer.',
    };
  }

  if (speakerPct < 50 && listenerPct < 50) {
    return {
      title: 'Emerging Connection',
      body: 'Both speaking and listening have room to grow. Small, consistent practice in both roles will gradually transform how connected you feel in your relationships.',
    };
  }

  return {
    title: 'Balanced Development',
    body: 'Your speaking and listening are growing in step with each other. Keep practicing both sides of the conversation — balance is the heart of intimacy.',
  };
}

interface GrowthZone {
  title: string;
  body: string;
  badge: 'STRENGTH' | 'FOCUS AREA';
  color: string;
}

function getGrowthZones(speakerPct: number, listenerPct: number): GrowthZone[] {
  const speakerStronger = speakerPct >= listenerPct;

  const speakerZone: GrowthZone = {
    title: 'Expressing Needs',
    body: speakerStronger
      ? 'You are comfortable articulating your feelings and boundaries clearly.'
      : 'Practicing I-statements and naming what you need will deepen your voice in conversations.',
    badge: speakerStronger ? 'STRENGTH' : 'FOCUS AREA',
    color: colors.primary.pink,
  };

  const listenerZone: GrowthZone = {
    title: 'Deep Listening',
    body: speakerStronger
      ? 'Working on presence and non-judgmental reception will enhance your intimacy.'
      : 'You hold space well — your partner feels heard and understood.',
    badge: speakerStronger ? 'FOCUS AREA' : 'STRENGTH',
    color: colors.accent.yellow,
  };

  return [speakerZone, listenerZone];
}

interface ChallengePractice {
  title: string;
  body: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const CHALLENGES: ChallengePractice[] = [
  {
    title: 'The Vulnerability Lead',
    body: 'Share one small insecurity today.',
    icon: 'mic',
    color: colors.primary.pink,
  },
  {
    title: 'Echo Practice',
    body: 'Repeat back what you heard before replying.',
    icon: 'hearing',
    color: colors.accent.yellow,
  },
];

export default function IntimacyResults() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const answers = useAtomValue(intimacyAnswersAtom);

  // Section scores (each section has 8 questions × 4 max = 32)
  const speakerQuestions = INTIMACY_QUESTIONS.filter(
    (q) => q.section === 'Speaker Role',
  );
  const listenerQuestions = INTIMACY_QUESTIONS.filter(
    (q) => q.section === 'Listener Role',
  );
  const speakerMax = speakerQuestions.length * 4;
  const listenerMax = listenerQuestions.length * 4;
  const speakerScore = speakerQuestions.reduce(
    (sum, q) => sum + (answers[q.id] ?? 0),
    0,
  );
  const listenerScore = listenerQuestions.reduce(
    (sum, q) => sum + (answers[q.id] ?? 0),
    0,
  );

  const speakerPct = (speakerScore / speakerMax) * 100;
  const listenerPct = (listenerScore / listenerMax) * 100;

  const insight = getInsight(speakerPct, listenerPct);
  const growthZones = getGrowthZones(speakerPct, listenerPct);

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 pb-4"
        style={{
          paddingTop: insets.top + 8,
          backgroundColor: 'rgba(0,0,0,0.8)',
        }}
      >
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold tracking-tight text-foreground">
          Quiz Results
        </Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        contentContainerClassName="px-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="items-center pb-8 pt-4">
          <Text className="mb-2 text-center text-3xl font-bold tracking-tight text-foreground">
            Speaker vs Listener
          </Text>
          <Text className="text-center text-sm text-foreground/60">
            Intimacy & Connection Assessment
          </Text>
        </View>

        {/* Score Rings */}
        <View className="mb-8 flex-row items-start justify-between gap-4">
          <ScoreRing
            score={speakerScore}
            max={speakerMax}
            label="Speaker Role"
            labelColor={colors.primary.pink}
            gradientId="speakerRingGrad"
          />
          <ScoreRing
            score={listenerScore}
            max={listenerMax}
            label="Listener Role"
            labelColor={colors.accent.yellow}
            gradientId="listenerRingGrad"
          />
        </View>

        {/* Insight Card */}
        <Card variant="surface" className="mb-8 p-5">
          <View className="mb-3 flex-row items-center gap-2">
            <MaterialIcons
              name="balance"
              size={20}
              color={colors.primary.pink}
            />
            <Text className="text-base font-bold text-foreground">
              {insight.title}
            </Text>
          </View>
          <Text className="text-sm leading-relaxed text-foreground/60">
            {insight.body}
          </Text>
        </Card>

        {/* Growth Zones */}
        <View className="mb-10">
          <Text className="mb-4 text-lg font-bold text-foreground">
            Growth Zones
          </Text>
          <View className="gap-4">
            {growthZones.map((zone) => (
              <View
                key={zone.title}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: withAlpha(zone.color, 0.05),
                  borderLeftWidth: 4,
                  borderLeftColor: zone.color,
                  borderTopWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderTopColor: withAlpha(zone.color, 0.3),
                  borderRightColor: withAlpha(zone.color, 0.3),
                  borderBottomColor: withAlpha(zone.color, 0.3),
                }}
              >
                <View className="mb-1 flex-row items-start justify-between">
                  <Text
                    className="text-sm font-bold"
                    style={{ color: zone.color }}
                  >
                    {zone.title}
                  </Text>
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: withAlpha(zone.color, 0.2) }}
                  >
                    <Text
                      className="text-[10px] font-bold uppercase tracking-tight"
                      style={{ color: zone.color }}
                    >
                      {zone.badge}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-foreground/60">{zone.body}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Connection Challenges */}
        <View>
          <Text className="mb-4 text-lg font-bold text-foreground">
            Connection Challenges
          </Text>
          <View className="gap-3">
            {CHALLENGES.map((challenge) => (
              <View
                key={challenge.title}
                className="flex-row items-center gap-4 rounded-xl border border-foreground/5 bg-surface-elevated p-4"
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: withAlpha(challenge.color, 0.1) }}
                >
                  <MaterialIcons
                    name={challenge.icon}
                    size={20}
                    color={challenge.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground">
                    {challenge.title}
                  </Text>
                  <Text className="text-[11px] text-foreground/60">
                    {challenge.body}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={withAlpha('#ffffff', 0.4)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
      >
        <GradientButton onPress={() => router.back()}>
          Finish & Log
        </GradientButton>
      </View>
    </View>
  );
}
